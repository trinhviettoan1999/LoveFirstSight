import * as React from 'react';
import {SvgXml} from 'react-native-svg';

export const Eye = () => (
  <SvgXml
    xml={`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z" stroke="#6A1616" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="#6A1616" stroke-linecap="round"/>
    </svg>
    `}
  />
);

export const EyeDisable = () => (
  <SvgXml
    xml={`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z" stroke="#6A1616" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="3" stroke="#6A1616" stroke-linecap="round"/>
      <path d="M3 21L20 4" stroke="#6A1616" stroke-linecap="round"/>
      </svg>      
      `}
  />
);

export const Filter = () => (
  <SvgXml
    xml={`
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 19C17.5523 19 18 19.4477 18 20C18 20.5523 17.5523 21 17 21H11C10.4477 21 10 20.5523 10 20C10 19.4477 10.4477 19 11 19H17ZM21 13C21.5523 13 22 13.4477 22 14C22 14.5523 21.5523 15 21 15H7C6.44772 15 6 14.5523 6 14C6 13.4477 6.44772 13 7 13H21ZM24 7C24.5523 7 25 7.44772 25 8C25 8.55228 24.5523 9 24 9H4C3.44772 9 3 8.55228 3 8C3 7.44772 3.44772 7 4 7H24Z" fill="#212121"/>
    </svg>
    `}
  />
);

export const Options = () => (
  <SvgXml
    xml={`
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.75 14C8.75 15.5188 7.51878 16.75 6 16.75C4.48122 16.75 3.25 15.5188 3.25 14C3.25 12.4812 4.48122 11.25 6 11.25C7.51878 11.25 8.75 12.4812 8.75 14Z" fill="#212121"/>
    <path d="M16.75 14C16.75 15.5188 15.5188 16.75 14 16.75C12.4812 16.75 11.25 15.5188 11.25 14C11.25 12.4812 12.4812 11.25 14 11.25C15.5188 11.25 16.75 12.4812 16.75 14Z" fill="#212121"/>
    <path d="M22 16.75C23.5188 16.75 24.75 15.5188 24.75 14C24.75 12.4812 23.5188 11.25 22 11.25C20.4812 11.25 19.25 12.4812 19.25 14C19.25 15.5188 20.4812 16.75 22 16.75Z" fill="#212121"/>
    </svg>
    `}
  />
);

export const Back = () => (
  <SvgXml
    xml={`
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6L8 12L14 18" stroke="#6A1616" stroke-width="2" stroke-linecap="round"/>
    </svg>  
    `}
  />
);
