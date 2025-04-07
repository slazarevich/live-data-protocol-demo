import {useEffect} from "react";

export function useInvokeOnTimer<T>(fn: () => Promise<T>, timeout: number): void {
    useEffect(() => {
        let timerId = setTimer();

        function setTimer() {
            return window.setTimeout(() => {
                fn().then(res => {
                    timerId = setTimer();
                    return res;
                });
            }, timeout);
        }

        return () => window.clearTimeout(timerId);
    }, [fn, timeout]);
}
