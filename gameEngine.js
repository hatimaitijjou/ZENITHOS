<script>
class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.running = false;
    this.paused = false;

    this.lastTime = 0;
    this.fps = 0;
    this.frames = 0;
    this.fpsTime = 0;
  }

  start() {
    this.running = true;
    this.paused = false;
    requestAnimationFrame(this.loop.bind(this));
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.running = false;
  }

  loop(time) {
    if (!this.running) return;
    if (this.paused) return;

    const delta = time - this.lastTime;
    this.lastTime = time;

    this.update(delta);
    this.render();

    // FPS
    this.frames++;
    this.fpsTime += delta;
    if (this.fpsTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.fpsTime = 0;
    }

    requestAnimationFrame(this.loop.bind(this));
  }

  update(delta) {
    // كل لعبة ستعيد تعريف هذه
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
</script>
