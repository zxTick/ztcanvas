# canvas 引擎
---
## 绘画
### 矩形
``` typescript
const engine = new CanvasEngine({
  w: "600",
  h: "600",
  canvasTarget: "canvas2",
});
const rect1 = new Rect({
  x: 10,
  y: 10,
  w: 100,
  h: 100,
});
engine.render(rect1, { color: "red" });

``` 

### 圆形
``` typescript
const engine = new CanvasEngine({
  w: "600",
  h: "600",
  canvasTarget: "canvas2",
});
const act = new Act({
  x: 100,
  y: 100,
  radius: 20,
  zIndex: 10,
});
engine.render(act, { color: "red" });

``` 

### 线
``` typescript
const engine = new CanvasEngine({
  w: 300,
  h: 300,
  target: '#canvas',
})

const line = new Line({
  x: 10,
  y: 10,
})

line.move(100, 75).move(100, 25).move(-200, -25).move(129, 290)
engine.render(line, {
  color: 'red',
  mode: 'stroke',
})

```
---
## 清除元素
``` typescript
const engine = new CanvasEngine({
  w: "600",
  h: "600",
  canvasTarget: "canvas2",
});
const act = new Act({
  x: 100,
  y: 100,
  radius: 20,
  zIndex: 10,
});
engine.render(act, {
  color: "red",
});
engine.clear(act);
```
---
## 清除空视图
``` typescript
const engine = new CanvasEngine({
  w: "600",
  h: "600",
  canvasTarget: "canvas2",
});
engine.clearView();
```
---
## 图层
``` typescript
const engine = new CanvasEngine({
  w: "600",
  h: "600",
  canvasTarget: "canvas2",
});
const act = new Act({
  x: 100,
  y: 100,
  radius: 20,
  zIndex: 10, //  图层
});
const sky = new Rect({
  x: 0,
  y: 0,
  w: 600,
  h: 400,
  zIndex: 9, //  图层
});
const di = new Rect({
  x: 0,
  y: 400,
  w: 600,
  h: 200,
});
engine.render(act, {
  color: "red",
});
engine.render(sky, {
  color: "blue",
});
engine.render(di, {
  color: "green",
});
const stopEvent = engine.addEventListener(di, "click", () => {
  engine.modifyShapeLayer(act, 7); //  修改图层
});

```
---
## 事件绑定
``` typescript
const engine = new CanvasEngine({
  w: "600",
  h: "600",
  canvasTarget: "canvas2",
});
const di = new Rect({
  x: 0,
  y: 400,
  w: 600,
  h: 200,
});
engine.render(di, {
  color: "green",
});
const stopEvent = engine.addEventListener(di, "click", () => {
  console.log('1')
});

```
---
## 清除事件
``` typescript
const engine = new CanvasEngine({
  w: "600",
  h: "600",
  canvasTarget: "canvas2",
});
const di = new Rect({
  x: 0,
  y: 400,
  w: 600,
  h: 200,
});
engine.render(di, {
  color: "green",
});
const stopEvent = engine.addEventListener(di, "click", () => {
  console.log('1')
});

engine.emptyEvents(di) // 清除全部事件
engine.clearEvents(di, 'click') // 清除指定事件

```


