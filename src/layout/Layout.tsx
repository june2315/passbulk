import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useSetState } from 'ahooks';
import type { PageState } from '@/interface';

export default function Layout() {
    const [state, setState] = useSetState<PageState>({
        searchValue: '',
    });

    const handleSearchChange = (event) => {
        // console.log('searchValue', event.target.value);
        setState({ searchValue: event.target.value });
    };

    const handleSearchConfirm = (searchValue: string) => {
        // console.log('search', searchValue);
        setState({ searchValue });
    };

    return (
        <div className="dark:text-white w-screen h-screen">
            <Header
                onSearchChange={handleSearchChange}
                onSearchConfirm={handleSearchConfirm}
                searchValue={state.searchValue}
            />
            <Outlet context={[state, setState]} />
        </div>
    );
}
