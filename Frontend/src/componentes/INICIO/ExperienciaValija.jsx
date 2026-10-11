import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './ExperienciaValija.css'

function crearTexturaDestino(titulo, subtitulo, colores) {
    const canvas = document.createElement('canvas')
    canvas.width = 360
    canvas.height = 480
    const context = canvas.getContext('2d')

    context.fillStyle = '#f6f0e6'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = colores.cielo
    context.fillRect(0, 0, canvas.width, 300)

    context.beginPath()
    context.arc(268, 93, 42, 0, Math.PI * 2)
    context.fillStyle = colores.sol
    context.fill()

    context.beginPath()
    context.moveTo(0, 256)
    context.lineTo(86, 112)
    context.lineTo(153, 219)
    context.lineTo(221, 128)
    context.lineTo(360, 267)
    context.lineTo(360, 300)
    context.lineTo(0, 300)
    context.closePath()
    context.fillStyle = colores.montana
    context.fill()

    context.beginPath()
    context.moveTo(0, 256)
    context.lineTo(99, 190)
    context.lineTo(171, 253)
    context.lineTo(269, 184)
    context.lineTo(360, 244)
    context.lineTo(360, 300)
    context.lineTo(0, 300)
    context.closePath()
    context.fillStyle = colores.valle
    context.fill()

    context.fillStyle = colores.agua
    context.fillRect(0, 268, 360, 32)
    context.fillStyle = 'rgba(255,255,255,.48)'
    context.fillRect(26, 278, 116, 3)
    context.fillRect(205, 289, 104, 3)

    context.fillStyle = '#1c2b3a'
    context.font = '600 35px Georgia, serif'
    context.fillText(titulo, 28, 365)
    context.fillStyle = '#68747a'
    context.font = '600 16px Arial, sans-serif'
    context.fillText(subtitulo.toUpperCase(), 30, 405)
    context.fillStyle = '#c97a3d'
    context.fillRect(30, 425, 58, 5)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
}

function crearEscena(host, abiertoRef) {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40)
    camera.position.set(0, 1.5, 7.5)
    camera.lookAt(0, -0.02, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xfff5e8, 0x526b7b, 2.2))

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1)
    keyLight.position.set(-3, 5, 5)
    scene.add(keyLight)

    const warmLight = new THREE.DirectionalLight(0xe79a59, 1.5)
    warmLight.position.set(4, 1, 3)
    scene.add(warmLight)

    const suitcase = new THREE.Group()
    suitcase.rotation.set(-0.035, -0.12, 0)
    scene.add(suitcase)

    const shellMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e4f7b,
        roughness: 0.34,
        metalness: 0.12,
    })
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x28618e,
        roughness: 0.42,
        metalness: 0.08,
    })
    const trimMaterial = new THREE.MeshStandardMaterial({
        color: 0xd28a4d,
        roughness: 0.32,
        metalness: 0.55,
    })
    const darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x263845,
        roughness: 0.58,
    })

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.5, 0.48), shellMaterial)
    body.position.y = -0.26
    suitcase.add(body)

    const tickets = new THREE.Group()
    const destinos = [
        { titulo: 'Patagonia', subtitulo: 'Sur argentino', colores: { cielo: '#b9d6d5', sol: '#e8ae69', montana: '#526f78', valle: '#78928b', agua: '#79aeb0' } },
        { titulo: 'Los Lagos', subtitulo: 'Bosques y agua', colores: { cielo: '#c5d8dc', sol: '#f0c17d', montana: '#526e62', valle: '#789481', agua: '#6c9da0' } },
        { titulo: 'Salta', subtitulo: 'Norte argentino', colores: { cielo: '#e5c59c', sol: '#e9a65d', montana: '#985e49', valle: '#c58b61', agua: '#d1a477' } },
    ]

    destinos.forEach((destino, index) => {
        const textura = crearTexturaDestino(destino.titulo, destino.subtitulo, destino.colores)
        const ticket = new THREE.Mesh(
            new THREE.PlaneGeometry(0.62, 0.82),
            new THREE.MeshBasicMaterial({ map: textura, side: THREE.DoubleSide }),
        )
        ticket.position.set((index - 1) * 0.73, -0.23, 0.285)
        tickets.add(ticket)
    })
    suitcase.add(tickets)

    const lid = new THREE.Group()
    lid.position.set(-1.275, -0.26, 0.24)
    suitcase.add(lid)

    const lidShell = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.42, 0.2), shellMaterial)
    lidShell.position.x = 1.275
    lid.add(lidShell)

    const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(2.34, 1.2, 0.035), panelMaterial)
    frontPanel.position.set(1.275, 0, 0.12)
    lid.add(frontPanel)

    for (let index = -3; index <= 3; index += 1) {
        const rib = new THREE.Mesh(
            new THREE.BoxGeometry(0.018, 1.04, 0.012),
            new THREE.MeshStandardMaterial({ color: 0x47779a, roughness: 0.42 }),
        )
        rib.position.set(1.275 + index * 0.3, 0, 0.145)
        lid.add(rib)
    }

    const lining = new THREE.Mesh(
        new THREE.BoxGeometry(2.27, 1.2, 0.025),
        new THREE.MeshStandardMaterial({ color: 0xe3c79e, roughness: 0.92 }),
    )
    lining.position.set(1.275, 0, -0.116)
    lid.add(lining)

    const pocket = new THREE.Mesh(
        new THREE.BoxGeometry(1.95, 0.32, 0.035),
        new THREE.MeshStandardMaterial({ color: 0xb86e42, roughness: 0.8 }),
    )
    pocket.position.set(1.275, -0.39, -0.14)
    lid.add(pocket)

    const pocketSeam = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.018, 0.012), trimMaterial)
    pocketSeam.position.set(1.275, -0.24, -0.162)
    lid.add(pocketSeam)

    const handleLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.13), darkMaterial)
    handleLeft.position.set(0.965, 0.91, 0.015)
    const handleRight = handleLeft.clone()
    handleRight.position.x = 1.585
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.13, 0.16), darkMaterial)
    handleBar.position.set(1.275, 1.04, 0.015)
    lid.add(handleLeft, handleRight, handleBar)

    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.38, 16), trimMaterial)
    hinge.position.set(-0.025, 0, 0)
    lid.add(hinge)

    for (const side of [-1, 1]) {
        const latch = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.25, 0.08), trimMaterial)
        latch.position.set(1.275 + side * 0.76, 0.49, 0.15)
        lid.add(latch)

        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.13, 20), darkMaterial)
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(side * 1.08, -1.03, 0)
        suitcase.add(wheel)
    }

    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1, 48),
        new THREE.MeshBasicMaterial({ color: 0x34444a, transparent: true, opacity: 0.13 }),
    )
    shadow.scale.set(2.2, 0.28, 1)
    shadow.position.set(0, -1.17, -0.35)
    scene.add(shadow)

    const drag = { active: false, x: 0, y: 0 }
    const onPointerDown = (event) => {
        drag.active = true
        drag.x = event.clientX
        drag.y = event.clientY
        renderer.domElement.setPointerCapture(event.pointerId)
        host.classList.add('is-dragging')
    }
    const onPointerMove = (event) => {
        if (!drag.active) return
        suitcase.rotation.y += (event.clientX - drag.x) * 0.008
        suitcase.rotation.x = THREE.MathUtils.clamp(
            suitcase.rotation.x + (event.clientY - drag.y) * 0.004,
            -0.24,
            0.2,
        )
        drag.x = event.clientX
        drag.y = event.clientY
    }
    const onPointerUp = () => {
        drag.active = false
        host.classList.remove('is-dragging')
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointercancel', onPointerUp)

    const startTime = performance.now()
    let animationFrame
    let apertura = 0

    const render = () => {
        const elapsed = (performance.now() - startTime) / 1000
        const target = abiertoRef.current ? 2.35 : 0
        apertura += (target - apertura) * 0.075
        lid.rotation.y = apertura
        tickets.visible = Math.abs(apertura) > 0.72
        suitcase.position.y = Math.sin(elapsed * 1.35) * 0.018
        renderer.render(scene, camera)
        animationFrame = window.requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(() => {
        const width = host.clientWidth
        const height = host.clientHeight
        if (!width || !height) return
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
    })
    resizeObserver.observe(host)
    animationFrame = window.requestAnimationFrame(render)

    return () => {
        window.cancelAnimationFrame(animationFrame)
        resizeObserver.disconnect()
        renderer.domElement.removeEventListener('pointerdown', onPointerDown)
        renderer.domElement.removeEventListener('pointermove', onPointerMove)
        renderer.domElement.removeEventListener('pointerup', onPointerUp)
        renderer.domElement.removeEventListener('pointercancel', onPointerUp)
        scene.traverse((object) => {
            object.geometry?.dispose()
            if (Array.isArray(object.material)) {
                object.material.forEach((material) => {
                    material.map?.dispose()
                    material.dispose()
                })
            } else if (object.material) {
                object.material.map?.dispose()
                object.material.dispose()
            }
        })
        renderer.dispose()
        renderer.domElement.remove()
    }
}

export default function ExperienciaValija({ abierta, onToggle }) {
    const hostRef = useRef(null)
    const abiertoRef = useRef(false)

    useEffect(() => {
        abiertoRef.current = abierta
    }, [abierta])

    useEffect(() => {
        if (!hostRef.current) return undefined
        return crearEscena(hostRef.current, abiertoRef)
    }, [])

    return (
        <section className="valija-hero" aria-labelledby="valija-titulo">
            <div className="valija-copy">
                <span className="valija-eyebrow">Descubriendo Rumbos</span>
                <h2 id="valija-titulo">Abrí la valija.<br />Elegí el rumbo.</h2>
                <p>Tu próxima historia empieza con un destino.</p>
                <button
                    className="valija-toggle"
                    type="button"
                    aria-expanded={abierta}
                    aria-controls="paquetes"
                    onClick={onToggle}
                >
                    <i className={`fa-solid ${abierta ? 'fa-xmark' : 'fa-suitcase-rolling'}`} aria-hidden="true" />
                    {abierta ? 'Cerrar valija' : 'Abrir valija y ver paquetes'}
                </button>
            </div>
            <div
                className="valija-scene"
                ref={hostRef}
                role="img"
                aria-label="Valija 3D azul con destinos de viaje en su interior"
            />
        </section>
    )
}
