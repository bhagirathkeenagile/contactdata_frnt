import React from 'react';

const MultiInput = ({ onInputChange }:any) => {
  return (
    <div>
      <input
        type="text"
        placeholder="--"
        onChange={(e) => onInputChange('map', e.target.value)}
      />/{" "}
      <input
        type="text"
        placeholder="--"
        onChange={(e) => onInputChange('action', e.target.value)}
      />/{" "}
      <input
        type="text"
        placeholder="--"
        onChange={(e) => onInputChange('input', e.target.value)}
      />
    </div>
  );
};

export default MultiInput;
