import React from 'react';
interface InputProps {
    title: string;
    afterText?: string | React.ReactElement;
    value: string | number;
    onChange: (e: {
        target: {
            value: string;
        };
    }) => void;
}
declare const Input: React.FC<InputProps>;
export default Input;
