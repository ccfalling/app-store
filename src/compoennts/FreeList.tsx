import { Rate } from '../lib/rate';
import { useState, useEffect, useRef, memo, useDeferredValue } from 'react'
import { AppInfo, AppDetail, lookup, topfreeapplications } from '../service/api';
import './FreeList.scss';

export type AppDetailMap = Record<string, AppDetail>;

function throttle<T>(fn: (params: T) => void, time: number) {
  let temp: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let paramTemp: T | null = null;
  return (params: T) => {
    const now = performance.now();
    const gap = temp ? now - temp : 0;
    if(!gap || (gap > time && timer === null)) {
      temp = now;
      fn(params);
    } else if(timer) {
      paramTemp = params;
    } else {
      paramTemp = params;
      timer = setTimeout(() => {
        fn(paramTemp as T)
        clearTimeout(timer as ReturnType<typeof setTimeout>);
        temp = performance.now();
        paramTemp = null;
        timer = null;
      }, time - gap);
    }
  }
}

export const FreeAppItem = memo(
  ({ info, detail, order }: { info: AppInfo, detail: AppDetail, order: number }) => {
    return (
      <div  className='item'>
        <div className='order'>{order}</div>
        <img src={info['im:image'][0].label} height={info['im:image'][0].attributes.height} className='cover'/>
        <div className='detail'>
          <div className='name'>{info.title.label}</div>
          <div className='category'>{info.category.attributes.label}</div>
          <div className='rate'>
            <Rate size="10" color="#f3d111" voidColor="#bdad52" value={Math.floor(detail?.averageUserRating * 10) / 10} allowHalf readOnly />
            <span className='rating-count'>({detail?.userRatingCount})</span>
          </div>
        </div>
      </div>
    )
  }
);

const pageSize = 10;
const height = 70;
const pageLength = 30;

export const AppPage = memo(({ list, page }: { list: AppInfo[], page: number }) => {
  const [appInfoMap, setAppInfoMap] = useState<AppDetailMap>({});
  const [appList, setAppList] = useState<AppInfo[]>([]);

  useEffect(() => {
    const pageList = list.slice(Math.max(0, page * pageSize), Math.min(pageLength + page * pageSize, list.length));
    setAppList(pageList);
    const ids = pageList.map(ele => ele.id.attributes['im:id']);
    if(ids.length) {
      lookup(ids).then(res => {
        const infoMap = res.reduce((pre, cur) => {
          const key = `${cur.trackId}`;
          pre[key] = cur;
          return pre;
         }, {} as AppDetailMap);
         setAppInfoMap(infoMap);
      });
    }
  }, [list, page]);
  return appList.map((ele, index) => 
    <FreeAppItem
      key={ele.id.attributes['im:id']}
      order={pageSize * page + index + 1}
      detail={appInfoMap[ele.id.attributes['im:id']]}
      info={ele}
    />
  )
});

export const VirtualList = ({ filter, list }: { list: AppInfo[], filter: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0);
  const [source, setList] = useState<AppInfo[]>([]);
  const deferPage = useDeferredValue(page);

  useEffect(() => {
    if (filter === '') {
      setList(list);
    } else {
      const res = list.filter((ele) => ele['im:name'].label.includes(filter)
        || ele['im:artist'].label.includes(filter)
        || ele.summary.label.includes(filter));
      setList(res);
    }
    wrapRef.current?.scrollTo(0, 0);
  }, [list, filter])

  useEffect(() => {
    const scollListen = throttle<Event>((event: Event) => {
      const scrollTop = (event.srcElement as HTMLDivElement)?.scrollTop;
      const currentPage = Math.floor(scrollTop / (height * pageSize));
      if (currentPage !== page) {
        setPage(currentPage);
      }
    }, 200)

    const divDom = wrapRef.current;
    divDom?.addEventListener('scroll', scollListen);
    return () => divDom?.removeEventListener('scroll', scollListen);
  }, [page]);

  return <div className='free-list' ref={wrapRef}>
  <div style={{height: height * source.length + 'px'}} className='wrap-list'>
    <div style={{ transform: `translateY(${deferPage * height * pageSize}px)` }} className='real-list'>
      <AppPage list={source} page={deferPage} />
    </div>
  </div>
</div>
} 

export default function FreeList({ filter }: { filter: string }) {
  if(topfreeapplications instanceof Promise) throw topfreeapplications;
  return <VirtualList list={topfreeapplications} filter={filter} />
}