function request(method: 'GET', url: string) {
  return fetch(url, {method}).then((res) => res.json())
}

const detailCache: Map<string, AppDetail> = new Map();

const host = 'https://itunes.apple.com';

export interface AppInfo {
  category: {
    attributes: {
      ['im:id']: string;
      label: string;
      scheme: string;
      term: string;
    }
  },
  id: {
    attributes: {
      ['im:bundleId']: string;
      ['im:id']: string;
    },
    label: string;
  },
  ['im:name']: {
    label: string;
  },
  ['im:image']: {
    label: string;
    attributes: {
      height: string;
    }
  }[],
  ['im:artist']: {
    label: string;
    attributes: {
      href: string;
    }
  },
  title: {
    label: string
  }
  summary: {
    label: string;
  }
}

export function getTopgrossingList(limit: number): Promise<AppInfo[]> {
  const url = `${host}/hk/rss/topgrossingapplications/limit=${limit}/json`;
  return request('GET', url).then(res => res.feed.entry);
}

export function getTopfreeList(limit: number): Promise<AppInfo[]> {
  const url = `${host}/hk/rss/topfreeapplications/limit=${limit}/json`;
  return request('GET', url).then(res => res.feed.entry);
}

export interface AppDetail {
  trackId: number;
  userRatingCount: number;
  averageUserRating: number;
}

export function lookup(ids: string[]): Promise<AppDetail[]> {
  const cache: string[] = [];
  const params: string[] = [];
  ids.forEach((ele) => {
    const isCached = detailCache.has(ele);
    if (isCached) {
      cache.push(ele);
    } else {
      params.push(ele);
    }
  });
  if (params.length) {
    if (detailCache.size > 99) {
      let num = 1;
      let keys = detailCache.keys();
      for (let key of keys) {
        detailCache.delete(key);
        num ++;
        if(num > params.length) {
          break;
        }
      }
    }
     
    const query = params.join(',');
    const url = `${host}/hk/lookup?id=${query}`;
    return request('GET', url).then(res => {
      const list = res.results;
      list.forEach((ele: AppDetail) => detailCache.set(`${ele.trackId}`, ele));
      return cache.map(ele => detailCache.get(ele) as AppDetail).concat(list);
    });
  } else {
    return Promise.resolve(ids.map((ele) => detailCache.get(ele) as AppDetail));
  }
}

export let topgrossingapplications: Promise<AppInfo[]> | AppInfo[] = getTopgrossingList(10).then(res => topgrossingapplications = res);
export let topfreeapplications: Promise<AppInfo[]> | AppInfo[] = getTopfreeList(100).then(res => topfreeapplications = res);