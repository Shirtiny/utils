/*
 * @Author: Shirtiny
 * @Date: 2021-12-14 13:52:08
 * @LastEditTime: 2021-12-14 14:55:53
 * @Description:
 */

import { jsx, style } from "../main";

const test = () => {
  interface IJsxButtonProps extends IJsxProps {
    type?: "default";
    title?: string;
    className?: string;
    onClick?: Function;
  }

  const Button: FC<IJsxButtonProps> = ({
    title,
    className,
    style,
    children,
    onClick,
  }) => {
    const handleClick = () => {
      onClick && onClick();
    };

    return (
      <button
        className={className}
        style={style}
        title={title}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  };
  const r = jsx.createDom(
    <div>
      <Button
        className="hi-class"
        style={style.css`position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);

    outline: none;
    border: none;
    color: #fff;
    background-color: rgba(0, 183, 195, 1);
    padding: 8px;
    border-radius: 3px;
    white-space: nowrap;
   :hover {
      background-color: rgba(0, 183, 195, 0.8);
    }
    cursor: pointer;
    transition: background-color 0.3s ease-out;`}
      >
        Hello World !
      </Button>
    </div>,
  );
  document.querySelector("#root")!.appendChild(r!);
};

const jsxTest = { test };

export default jsxTest;
