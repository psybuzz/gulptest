// Start the main application.
var app = new Application({
	canvasView: CanvasView,
	sceneManager: SceneManager
});

app.sceneManager.registerScene('chairs', new ChairsScene());
app.sceneManager.loadScene('chairs').play();