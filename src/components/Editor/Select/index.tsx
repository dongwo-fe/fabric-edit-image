import React from 'react';

export const DropdownIndicator = () => {
  return (
    <img src="https://ossprod.jrdaimao.com/file/1690959702767983.svg" alt=""/>
  );
};

export const ReactSelectStyles: any = {
  singleValue: (provided: any) => ({
    ...provided,
    color: '#ADADB3',
    fontWeight: 600,
  }),
  menuList: (provided: any) => ({
    ...provided,
    background: '#1C1D29',
  }),
  option: (provided: any) => ({
    ...provided,
    background: '#1C1D29',
    color: '#ADADB3',
    height: '32px',
    lineHeight: '32px',
    padding: '0px 11px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
      color: '#fff',
      background: '#2C375E'
    }
  }),
  container: (provided: any) => ({
    ...provided,
    width: '100%'
  }),
  control: () => ({
    width: '100%',
    cursor: 'pointer',
    paddingRight: 8,
    boxSizing: 'border-box',
    flex: 1,
    height: 28,
    borderRadius: 4,
    background: '#232634',
    color: '#ADADB3',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex'
  }),
}
