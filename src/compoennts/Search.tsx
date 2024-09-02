import { Search as SearchIcon, Cross } from '@react-vant/icons';
import { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react'
import './Search.scss';

export default function Search({ onSearch }: { onSearch: (val: string) => void }) {
  const [keywords, setVal] = useState('');
  const inputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setVal(event.target?.value);
  }, []);

  const onEnter = useCallback((event: KeyboardEvent) => {
    if(event.key === 'Enter') {
      onSearch(keywords);
    }
  }, [keywords, onSearch]);

  const onClear = useCallback(() => {
    setVal('')
  }, []);

  return (
    <div className='search-wrap'>
      <SearchIcon className='before-icon' />
      <input
        className='search-input'
        value={keywords}
        onChange={inputChange}
        onKeyDown={onEnter}
        placeholder='Search...'
        type='search'
        data-testid="input"
      />
      <Cross className='after-icon' fontSize={keywords ? 16 : 0} onPointerDown={onClear} data-testid="afterIcon" />
    </div>
  )
}