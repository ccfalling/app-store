import { topgrossingapplications } from '../service/api';
import './Recommend.scss';

const  Recommend = () => {
  if (topgrossingapplications instanceof Promise) {
    throw topgrossingapplications;
  }
  return (
    <div className='recommend-wrap'>
      {topgrossingapplications.map((ele, i) => {
        const height = ele['im:image'][1].attributes.height;
        return <div key={i} className='recomment-item' style={{width: height + 'px'}}>
          <img src={ele['im:image'][1].label} height={height} className='cover' />
          <div className='name'>{ele['im:name'].label}</div>
          <div className='category'>{ele.category.attributes.label}</div>
        </div>
      })}
    </div>
  )
}
export default Recommend;