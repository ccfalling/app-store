import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable no-nested-ternary */
import React, { useRef, useMemo } from 'react';
import { Star, StarO } from '@react-vant/icons';
import clsx from 'clsx';
import { addUnit, createNamespace, preventDefault } from '../utils';
import useRefs from '../hooks/use-refs';
import useMergedState from '../hooks/use-merged-state';
import useEventListener from '../hooks/use-event-listener';
import { useTouch } from '../hooks';
import { mergeProps } from '../utils/get-default-props';
function getRateStatus(value, index, allowHalf, readOnly) {
  if (value >= index) {
    return {
      status: 'full',
      value: 1
    };
  }
  if (value + 0.5 >= index && allowHalf && !readOnly) {
    return {
      status: 'half',
      value: 0.5
    };
  }
  if (value + 1 >= index && allowHalf && readOnly) {
    const cardinal = Math.pow(10, 10);
    return {
      status: 'half',
      value: Math.round((value - index + 1) * cardinal) / cardinal
    };
  }
  return {
    status: 'void',
    value: 0
  };
}
const [bem] = createNamespace('rate');
const Rate = _a => {
  var {
      count = 5,
      touchable = true,
      onChange
    } = _a,
    p = __rest(_a, ["count", "touchable", "onChange"]);
  const props = mergeProps(p, {
    size: 20,
    gutter: 4,
    icon: _jsx(Star, {}),
    voidIcon: _jsx(StarO, {})
  });
  const [value, setValue] = useMergedState({
    value: props.value,
    defaultValue: props.defaultValue
  });
  const root = useRef(null);
  const touch = useTouch();
  const [itemRefs, setItemRefs] = useRefs();
  const untouchable = () => props.readOnly || props.disabled || !touchable;
  const list = useMemo(() => Array(count).fill('').map((_, i) => getRateStatus(value, i + 1, props.allowHalf, props.readOnly)), [count, value, props.allowHalf, props.readOnly]);
  const ranges = useRef();
  const updateRanges = () => {
    const rects = itemRefs.map(item => item.getBoundingClientRect());
    ranges.current = [];
    rects.forEach((rect, index) => {
      if (props.allowHalf) {
        ranges.current.push({
          score: index + 0.5,
          left: rect.left
        }, {
          score: index + 1,
          left: rect.left + rect.width / 2
        });
      } else {
        ranges.current.push({
          score: index + 1,
          left: rect.left
        });
      }
    });
  };
  const getScoreByPosition = x => {
    // eslint-disable-next-line no-plusplus
    for (let i = ranges.current.length - 1; i > 0; i--) {
      if (x > ranges.current[i].left) {
        return ranges.current[i].score;
      }
    }
    return props.allowHalf ? 0.5 : 1;
  };
  const select = index => {
    if (!props.disabled && !props.readOnly && index !== value) {
      setValue(index);
      onChange === null || onChange === void 0 ? void 0 : onChange(index);
    }
  };
  const onTouchStart = event => {
    if (untouchable()) {
      return;
    }
    touch.start(event.nativeEvent);
    updateRanges();
  };
  const onTouchMove = event => {
    if (untouchable()) {
      return;
    }
    touch.move(event);
    if (touch.isHorizontal()) {
      const {
        clientX
      } = event.touches[0];
      preventDefault(event);
      select(getScoreByPosition(clientX));
    }
  };
  const renderStar = (item, index) => {
    const {
      icon,
      size,
      color,
      gutter,
      voidIcon,
      disabled,
      voidColor,
      allowHalf,
      disabledColor
    } = props;
    const score = index + 1;
    const isFull = item.status === 'full';
    const isVoid = item.status === 'void';
    const renderHalf = allowHalf && item.value > 0 && item.value < 1;
    let style;
    if (gutter && score !== +count) {
      style = {
        marginRight: addUnit(gutter)
      };
    }
    const onClickItem = event => {
      updateRanges();
      select(allowHalf ? getScoreByPosition(event.clientX) : score);
    };
    return _jsxs("div", Object.assign({
      ref: setItemRefs(index),
      role: 'radio',
      style: style,
      className: clsx(bem('item')),
      tabIndex: 0,
      "aria-setsize": parseInt(count === null || count === void 0 ? void 0 : count.toString(), 10),
      "aria-posinset": score,
      "aria-checked": !isVoid,
      onClick: onClickItem
    }, {
      children: [React.cloneElement(isFull ? icon : voidIcon, {
        className: clsx(bem('icon', {
          disabled,
          full: isFull
        })),
        style: {
          color: disabled ? disabledColor : isFull ? color : voidColor,
          fontSize: size
        }
      }), renderHalf && _jsx("div", Object.assign({
        className: clsx(bem('icon', ['half'])),
        style: {
          width: `${item.value * 100}%`
        }
      }, {
        children: React.cloneElement(isVoid ? voidIcon : icon, {
          className: clsx(bem('icon', [{
            disabled,
            full: !isVoid
          }])),
          style: {
            color: disabled ? disabledColor : isVoid ? voidColor : color,
            fontSize: size
          }
        })
      }))]
    }), index);
  };
  useEventListener('touchmove', onTouchMove, {
    target: root.current,
    depends: [touch.deltaY.current]
  });
  return _jsx("div", Object.assign({
    ref: root,
    role: 'radiogroup',
    className: clsx(bem({
      readOnly: props.readOnly,
      disabled: props.disabled
    })),
    tabIndex: 0,
    onTouchStart: onTouchStart
  }, {
    children: list.map(renderStar)
  }));
};
export default Rate;