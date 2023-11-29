import React from 'react';
interface InputNumberProps {
    value: string | number;
    onChange: (value: string | number) => void;
}
declare const InputNumber: React.FC<InputNumberProps>;
export default InputNumber;
