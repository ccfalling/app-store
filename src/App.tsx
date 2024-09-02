import { useCallback, Suspense, useState } from 'react'
import Search from './compoennts/Search';
import Recommend from './compoennts/Recommend';
import FreeList from './compoennts/FreeList';
import Loading from './compoennts/Loading';
import './App.css';

function App() {
  const [keywords, setKeywords] = useState('')
  const onSearch = useCallback((val: string) => {
    setKeywords(val.trim())
  }, []);

  return (
    <div className='main-page'>
      <div className='search'>
        <Search onSearch={onSearch} />
      </div>
      <div className='recommend'>
        <div className='title'>Recommend</div>
        <Suspense fallback={<Loading />}>
          <Recommend />
        </Suspense>
      </div>
      <div className='content'>
        <Suspense fallback={<Loading />}>
          <FreeList filter={keywords} />
        </Suspense>
      </div>
    </div>
  )
}

export default App
