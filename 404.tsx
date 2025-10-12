import { useEffect } from 'react';

export default function NotFound() {

    useEffect(() => {
        document.title = "404";
    }, []);

    return (
        <div>
            404
        </div>
    );
}
