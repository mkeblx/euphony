class Scene
  constructor: (container) ->
    time = Date.now()

    # set dom container
    $container = $(container)
    width = $container.width()
    height = $container.height()

    # create scene
    scene = new THREE.Scene()

    # create camera
    camera = new THREE.PerspectiveCamera(60, width / height, 0.001, 100000)
    camera.position.set(0,0,0);
    camera.lookAt(new THREE.Vector3())
    scene.add(camera)

    # create renderer
    renderer = new THREE.WebGLRenderer(antialias: true)
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 1)
    renderer.autoClear = false
    $container.append(renderer.domElement)

    #VR
    effect = new THREE.VREffect(renderer) 
    controls = new THREE.VRControls(camera)

    # create lights
    ambientLight = new THREE.AmbientLight(0x222222)
    scene.add(ambientLight)

    mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
    mainLight.position.set(1, 2, 4).normalize()
    scene.add(mainLight)

    auxLight = new THREE.DirectionalLight(0xffffff, 0.3)
    auxLight.position.set(-4, -1, -2).normalize()
    scene.add(auxLight)

    camera.position.add(new THREE.Vector3(8, 6, 15))

    $(window).resize(@onresize)

    # set instance variables
    @time = time


    @$container = $container
    @camera = camera
    @scene = scene
    @renderer = renderer
    @effect = effect
    @controls = controls

  onresize: =>
    [width, height] = [@$container.width(), @$container.height()]
    @camera.aspect = width / height
    @camera.updateProjectionMatrix()
    @renderer.setSize(width, height)

  add: (object) ->
    @scene.add(object)

  remove: (object) ->
    @scene.remove(object)

  animate: (callback) =>
    requestAnimationFrame => @animate(callback)
    callback?()

    if (1)
        @controls.update()
        @effect.render( @scene, @camera)
    else
        @renderer.clear()
        @renderer.render(@scene, @camera)

    @time = Date.now()

# export Scene to global
@Scene = Scene
