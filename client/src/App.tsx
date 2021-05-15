import './App.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Users } from './users';

function App() {
    // const inputEl = useRef<HTMLElement>(null);
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const isIsogram = (inputString: string): boolean => {
        const listOfChars = inputString.replaceAll(' ', '').toLowerCase().split('');
        let isIsogram = true;
        for (let index = 0; index < listOfChars.length; index++) {
            const element = listOfChars[index];
            if (listOfChars.filter(x => x == element).length > 1) {
                isIsogram = false;
                break;
            }
        }
        return isIsogram;
    }
    // const callback = useCallback(test, [name]);
    // const memo = useMemo(() => test, [name]);
    const clickHandler = () => {
        // if (inputEl.current) {
        //     inputEl.current.textContent = 'pathak';
        //     setName(name => name + '1');
        // }

    };
    const setInputValue = (e: any) => {
        // setInput(e.target.value);
        const inputStr = e.target.value;
        if (isIsogram(inputStr)) {
            setOutput('input is an isogram');
        } else {
            setOutput('input is not an isogram');
        }
    }
    return (
        <div className="App">
            <Users />
        </div>
    );
}

export default App;
