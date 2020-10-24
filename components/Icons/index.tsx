import React from 'react';
import { Path, Svg } from 'react-native-svg';

import { colors } from '../../common/styleguide';

type Props = {
  fill?: string;
  width?: number;
  height?: number;
};

export function Search(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 19} height={height || 19} viewBox="0 0 19 19" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.572.3A7.19 7.19 0 00.38 7.49a7.19 7.19 0 007.192 7.188 7.163 7.163 0 004.26-1.396l5.092 5.02 1.456-1.475-5.071-5A7.19 7.19 0 007.573.3zM2.452 7.49a5.118 5.118 0 015.12-5.117c2.828 0 5.12 2.29 5.12 5.117a5.118 5.118 0 01-5.12 5.117 5.118 5.118 0 01-5.12-5.117z"
        fill={fill}
      />
    </Svg>
  );
}

export function Star(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 20} height={height || 19} viewBox="0 0 20 19" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.764.081l2.723 6.323 6.856.636-5.173 4.544 1.514 6.716-5.92-3.515-5.92 3.515 1.514-6.716L.186 7.04l6.855-.636L9.764.081zm0 5.057L8.408 8.286l-3.413.317 2.575 2.262-.753 3.345 2.947-1.75 2.948 1.75-.754-3.345 2.576-2.262-3.414-.317-1.356-3.148z"
        fill={fill}
      />
    </Svg>
  );
}

export function Web(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 18} height={height || 19} viewBox="0 0 18 19" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.059 16.473a6.744 6.744 0 100-13.487 6.744 6.744 0 000 13.487zm0 2a8.744 8.744 0 100-17.487 8.744 8.744 0 000 17.487z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.607 15.54c.576-1.437.954-3.49.954-5.81 0-2.32-.378-4.374-.954-5.811-.289-.721-.608-1.238-.91-1.558-.302-.318-.517-.375-.638-.375-.12 0-.336.057-.637.375-.303.32-.622.837-.911 1.558-.576 1.437-.954 3.49-.954 5.81 0 2.32.378 4.374.954 5.811.289.722.608 1.238.91 1.558.302.318.517.375.638.375.12 0 .336-.057.637-.375.303-.32.622-.836.911-1.558zM9.06 18.473c1.934 0 3.502-3.914 3.502-8.743 0-4.83-1.568-8.744-3.502-8.744-1.934 0-3.502 3.915-3.502 8.744s1.568 8.743 3.502 8.743z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.794 6.877H16.21v1H1.794v-1zM1.794 11.877H16.21v1H1.794v-1z"
        fill={fill}
      />
    </Svg>
  );
}

export function Arrow(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 9} height={height || 16} viewBox="0 0 9 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.146 7.942L.22 2.015 1.634.601l7.34 7.34-7.318 7.32L.24 13.845l5.905-5.904z"
        fill={fill}
      />
    </Svg>
  );
}

export function Badge(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 20} height={height || 26} viewBox="0 0 20 26" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.718 17.23a9.54 9.54 0 10-11.503-.094v8.497l5.837-2.855 5.666 2.87V17.23zm1.851-7.659a7.54 7.54 0 11-15.08 0 7.54 7.54 0 0115.08 0zm-3.85 8.801a9.511 9.511 0 01-3.69.74 9.51 9.51 0 01-3.813-.793v4.11l3.852-1.885 3.65 1.85v-4.022z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.997 4.47c.19.109.342.328.42.694.08.366.077.846-.015 1.417-.035.219-.084.45-.144.688a13.636 13.636 0 00-1.734-.267 13.455 13.455 0 00-1.1-1.357 7.99 7.99 0 01.528-.468c.451-.365.87-.607 1.228-.722.359-.115.626-.094.817.015zM9.634 5.645a7.982 7.982 0 00-.528-.468c-.452-.365-.87-.607-1.229-.722-.358-.115-.625-.094-.816.015-.19.109-.342.328-.42.694-.08.366-.078.846.015 1.417.035.219.083.45.144.688.535-.12 1.118-.21 1.734-.267.357-.502.728-.957 1.1-1.357zm4.018 2.302a13.39 13.39 0 01-.634 1.624c.26.558.471 1.105.634 1.624.239-.067.464-.14.673-.22.544-.205.964-.444 1.244-.695.28-.25.395-.49.395-.709 0-.218-.115-.458-.395-.709-.28-.25-.7-.489-1.244-.695a8.048 8.048 0 00-.673-.22zm-3.229 5.55c.372-.4.743-.855 1.1-1.356.617-.057 1.2-.147 1.735-.268.06.24.109.47.144.689.092.57.094 1.051.016 1.417-.08.365-.23.585-.421.694-.19.11-.458.13-.817.015-.358-.116-.777-.358-1.228-.722a7.983 7.983 0 01-.529-.469zm-1.889-1.356c.357.501.728.957 1.1 1.356a7.945 7.945 0 01-.528.469c-.452.364-.87.607-1.229.722-.358.115-.625.094-.816-.015-.19-.11-.342-.329-.42-.694-.08-.366-.078-.847.015-1.417.035-.22.083-.45.144-.689.535.12 1.118.211 1.734.268zM7.04 9.571c-.259.558-.47 1.105-.633 1.624a8.032 8.032 0 01-.673-.22c-.544-.205-.965-.444-1.244-.695-.28-.25-.396-.49-.396-.709 0-.218.116-.458.396-.709.28-.25.7-.489 1.244-.695.209-.079.434-.152.673-.22.162.52.374 1.066.633 1.624zm4.149 0c0 .636-.52 1.15-1.16 1.15-.64 0-1.158-.514-1.158-1.15 0-.635.519-1.15 1.159-1.15s1.159.515 1.159 1.15z"
        fill={fill}
      />
    </Svg>
  );
}

export function Calendar(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 16} height={height || 18} viewBox="0 0 16 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.238.79a1 1 0 011 1v.164h3.874V1.79a1 1 0 112 0v.163h3.802v15.77H.144V1.954h4.094V1.79a1 1 0 011-1zm4.874 3.164v.023a1 1 0 102 0v-.023h1.802v3.101H2.144V3.954h2.094v.023a1 1 0 102 0v-.023h3.874zM2.144 8.626v7.098h11.77V8.612l-11.77.014z"
        fill={fill}
      />
    </Svg>
  );
}

export function Check(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 19} height={height || 13} viewBox="0 0 19 13" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.439 1.443L6.962 12.92.827 6.785 2.24 5.37l4.72 4.72L17.026.03l1.414 1.414z"
        fill={fill}
      />
    </Svg>
  );
}

export function Download(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 13} height={height || 16} viewBox="0 0 13 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.44 7.518h3.304V1.01a.817.817 0 011.635 0v6.51h3.266l-4.08 5.752-4.124-5.753zM12.45 15.77H.635v-1.635H12.45v1.635z"
        fill={fill}
      />
    </Svg>
  );
}

export function Filter(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 21} height={height || 18} viewBox="0 0 21 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.66.087H.227L7.77 9.029v5.414l5.953 3.472v-9.1L20.66.087zM9.77 13.294l1.953 1.14V8.116l4.792-6.03H4.531l5.24 6.211v4.996z"
        fill={fill}
      />
    </Svg>
  );
}

export function Issue(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 19} height={height || 19} viewBox="0 0 19 19" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.49 10.999V5.005h2v5.994h-2zM9.49 14.061a1.041 1.041 0 100-2.082 1.041 1.041 0 000 2.082z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.49 16.277a6.744 6.744 0 100-13.487 6.744 6.744 0 000 13.487zm0 2A8.744 8.744 0 109.49.79a8.744 8.744 0 000 17.487z"
        fill={fill}
      />
    </Svg>
  );
}

export function Logo(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 25} height={height || 22} viewBox="0 0 25 22" fill="none">
      <Path
        d="M12.029 13.03a2.334 2.334 0 002.343-2.325 2.334 2.334 0 00-2.343-2.326 2.334 2.334 0 00-2.343 2.325 2.334 2.334 0 002.343 2.326zM18.88 1.794c-.16-.74-.466-1.183-.851-1.404-.385-.22-.926-.262-1.65-.03-.725.234-1.571.723-2.485 1.46-.35.283-.708.6-1.068.947a27.206 27.206 0 012.225 2.743c1.246.114 2.424.298 3.505.54.123-.483.221-.948.293-1.391.186-1.154.19-2.125.03-2.865zM10.163 1.82c.351.283.708.6 1.068.947A27.215 27.215 0 009.007 5.51a27.564 27.564 0 00-3.506.54c-.123-.483-.22-.948-.292-1.391-.186-1.153-.19-2.125-.031-2.865.16-.74.466-1.183.85-1.403C6.415.17 6.955.128 7.68.36s1.57.722 2.484 1.459zM19.354 7.421a27.05 27.05 0 01-1.281 3.284 27.04 27.04 0 011.28 3.283c.484-.136.939-.284 1.361-.444 1.1-.417 1.95-.9 2.515-1.406.566-.507.8-.992.8-1.433 0-.442-.234-.927-.8-1.434-.565-.506-1.415-.988-2.515-1.405-.422-.16-.877-.309-1.36-.445zM15.05 15.9a27.207 27.207 0 01-2.224 2.742c.36.348.718.664 1.069.947.913.737 1.759 1.227 2.483 1.46.725.232 1.266.19 1.65-.03.386-.221.693-.665.852-1.404.16-.74.155-1.711-.031-2.864-.072-.444-.17-.909-.293-1.392a27.56 27.56 0 01-3.505.54zM9.007 15.9a27.21 27.21 0 002.224 2.742c-.36.348-.717.664-1.068.947-.913.737-1.759 1.227-2.484 1.46-.725.232-1.265.19-1.65-.03-.385-.221-.692-.665-.851-1.404-.16-.74-.155-1.711.031-2.864.071-.444.17-.909.292-1.392a27.56 27.56 0 003.506.54zM4.704 13.988c.329-1.05.758-2.155 1.28-3.283a27.043 27.043 0 01-1.28-3.284c-.483.136-.938.285-1.36.445-1.1.417-1.95.899-2.516 1.405-.565.507-.8.992-.8 1.434 0 .441.235.926.8 1.433.566.507 1.416.989 2.515 1.405.423.16.877.31 1.36.445z"
        fill={fill}
      />
    </Svg>
  );
}

export function Plus(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 16} height={height || 16} viewBox="0 0 16 16" fill="none">
      <Path fillRule="evenodd" clipRule="evenodd" d="M.114 7.12H15.57v2H.114v-2z" fill={fill} />
      <Path fillRule="evenodd" clipRule="evenodd" d="M6.842 15.848V.393h2v15.455h-2z" fill={fill} />
    </Svg>
  );
}

export function Sort(props: Props) {
  const { width, height, fill = colors.black } = props;
  return (
    <Svg width={width || 20} height={height || 12} viewBox="0 0 20 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.954 2.978H.38V.758h12.574v2.22zM11.239 7.421L.379 7.416l.002-2.219 10.859.005-.001 2.22zM9.52 11.854H.38V9.635h9.14v2.22zM12.954 6.963h2.797V1.45a.692.692 0 011.384 0v5.512h2.766l-3.455 4.871-3.492-4.871z"
        fill={fill}
      />
    </Svg>
  );
}

export function Thumbnail({ width = 16, height = 16, fill = colors.gray3 }: Props) {
  return (
    <Svg width={width} height={height} fill="none">
      <Path fillRule="evenodd" clipRule="evenodd" d="M14 2H2v12h12V2zM0 0v16h16V0H0z" fill={fill} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 7.586l3 3 2-2 3.707 3.707-1.414 1.414L12 11.414l-.586.586 2.293 2.293-1.414 1.414L7 10.414l-5.293 5.293-1.414-1.414L7 7.586z"
        fill={fill}
      />
      <Path d="M12 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill={fill} />
    </Svg>
  );
}

export function License({ width = 16, height = 18, fill = colors.black }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 18" fill="none">
      <Path
        fill={fill}
        d="M0,0v18h16V0H0z M14,15.9H2V3.1h12C14,3.1,14,15.9,14,15.9z M12,13H4v-1h8V13z M12,10.5H4v-1h8V10.5z M12,8H4V7h8V8z"
      />
    </Svg>
  );
}

export function Fork({ width = 15, height = 16, fill = colors.black }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 15 16" fill="none">
      <Path
        fill={fill}
        d="M8.5,10.8V8l4.7-5l0,2.3H15V0H9.7v1.8H12L7.5,6.5L3,1.8h2.3V0H0v5.3h1.8V3l4.7,5v2.9"
      />
      <Path
        fill={fill}
        d="M10.7,12.8c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2s1.4-3.2,3.2-3.2S10.7,11.1,10.7,12.8z M7.5,11.4c-0.8,0-1.4,0.6-1.4,1.4s0.6,1.4,1.4,1.4s1.4-0.6,1.4-1.4S8.3,11.4,7.5,11.4z"
      />
    </Svg>
  );
}

export function Code({ width = 16, height = 16, fill = colors.black }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path fill={fill} d="M0,8l5-3.2v2L2.8,8L5,9.3v2L0,8z" />
      <Path fill={fill} d="M13.2,8L11,6.7v-2L16,8l-5,3.3v-2L13.2,8z" />
      <Path fill={fill} d="M7.3,13.8H5.8l3-11.5h1.5L7.3,13.8z" />
    </Svg>
  );
}

export function Warning({ width = 17, height = 17, fill = colors.warningDark }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
      <Path
        d="M12.147 22.345c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zM12.147 8.345v4M12.147 16.345h.01"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TypeScript(props: Props) {
  const { width = 16, height = 16, fill = colors.black } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        fill={fill}
        d="M0,0v8v8h16V0H0z M9.1,8.7H7v5.9H5.6V8.7H3.5V7.4h5.6V8.7z M14.5,13.4c-0.3,0.7-0.9,1.1-1.8,1.3c-0.3,0-0.9,0-1.2,0c-0.6-0.1-1.3-0.4-1.6-0.9c-0.1-0.2-0.4-0.6-0.4-0.6l0.2-0.1l0.6-0.3l0.5-0.3l0.1,0.1c0.1,0.2,0.4,0.5,0.6,0.6c0.5,0.3,1.2,0.2,1.6-0.1c0.1-0.1,0.2-0.3,0.2-0.5c0-0.2,0-0.3-0.1-0.4c-0.1-0.2-0.4-0.3-1.1-0.6c-0.8-0.4-1.2-0.6-1.5-0.9c-0.2-0.2-0.4-0.5-0.4-0.8c-0.1-0.2-0.1-0.8,0-1c0.2-0.8,0.8-1.4,1.6-1.5c0.3-0.1,0.9,0,1.2,0l0,0c0.4,0.1,0.7,0.3,1,0.6c0.1,0.2,0.4,0.4,0.4,0.5c0,0-0.7,0.5-1.1,0.8c0,0-0.1-0.2-0.1-0.2c-0.2-0.3-0.4-0.4-0.8-0.4c-0.5,0-0.8,0.2-0.8,0.6c0,0.1,0,0.2,0.1,0.3c0.1,0.2,0.3,0.4,0.9,0.6c1.1,0.5,1.6,0.8,1.9,1.3C14.7,12,14.8,12.8,14.5,13.4z"
      />
    </Svg>
  );
}

export function PlatformTvOS(props: Props) {
  const { width = 18, height = 18, fill = colors.black } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 5h18v12H3z" opacity=".3" fill={fill} />
      <Path
        fill={fill}
        d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"
      />
    </Svg>
  );
}

export function PlatformMacOS(props: Props) {
  const { width = 18, height = 18, fill = colors.black } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5h16v11H4z" opacity=".3" fill={fill} />
      <Path
        fill={fill}
        d="M20 18c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2H0c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2h-4zM4 5h16v11H4V5zm8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
      />
    </Svg>
  );
}

export function PlatformIOS(props: Props) {
  const { width = 18, height = 18, fill = colors.black } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M7 5h10v14H7z" opacity=".3" fill={fill} />
      <Path
        fill={fill}
        d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"
      />
    </Svg>
  );
}

export function PlatformAndroid(props: Props) {
  const { width = 18, height = 18, fill = colors.black } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fill={fill}
        d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71s-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"
      />
    </Svg>
  );
}

export function PlatformWeb(props: Props) {
  const { width = 18, height = 18, fill = colors.black } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <rect height="3.5" opacity=".3" width="10.5" x="4" y="9" fill={fill} />
      <rect height="3.5" opacity=".3" width="10.5" x="4" y="14.5" fill={fill} />
      <rect height="9" opacity=".3" width="3.5" x="16.5" y="9" fill={fill} />
      <Path
        fill={fill}
        d="M20,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M14.5,18L4,18v-3.5h10.5 V18z M14.5,12.5H4V9h10.5V12.5z M20,18l-3.5,0V9H20V18z"
      />
    </Svg>
  );
}

export function PlatformWindows(props: Props) {
  const { width = 18, height = 18, fill = colors.black } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
      <path
        fill={fill}
        d="M0,4.5l13.1-1.8l0,12.6L0,15.5L0,4.5z M13.1,16.8l0,12.6L0,27.7l0-10.9L13.1,16.8z M14.7,2.5L32,0v15.2l-17.3,0.1L14.7,2.5z M32,17l0,15.1l-17.3-2.4l0-12.7L32,17z"
      />
    </Svg>
  );
}
