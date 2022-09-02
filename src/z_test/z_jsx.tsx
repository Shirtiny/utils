/*
 * @Author: Shirtiny
 * @Date: 2021-12-14 13:52:08
 * @LastEditTime: 2021-12-14 15:32:03
 * @Description:
 */

import { jsx, style, dom, IJsxProps, FC } from "../main";

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
    <div
      theDay="theDay"
      className="aaa"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #000",
        height: "100px",
        width: "200px",
      }}
    >
      <Button
        onClick={() => alert("aaaa")}
        className="hi-class"
        style={style.css`
    outline: none;
    border: none;
    color: #fff;
    background-color: rgba(0, 183, 195, 1);
    padding: 8px;
    border-radius: 3px;
    white-space: nowrap;

    cursor: pointer;
    transition: background-color 0.3s ease-out;`}
      >
        Hello World !
      </Button>
    </div>,
  );

  dom.append(document.querySelector("#root"), r);
};

const jsxTest = { test };

export default jsxTest;
