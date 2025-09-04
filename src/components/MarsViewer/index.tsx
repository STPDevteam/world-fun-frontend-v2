"use client";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import styles from './styles.module.css';

const MarsViewer = ({ width = "100%", height = "100%", locations }: any) => {
    const containerRef: any = useRef(null);
    const earthDivRef: any = useRef(null);
    const infoPanelRef: any = useRef(null);

    const threeRefs: any = useRef({
        camera: null,
        scene: null,
        renderer: null,
        earthGeometry: null,
        earthMaterial: null,
        earthMesh: null,
        galaxy: null,
        cameraRotation: 0,
        cameraRotationSpeed: 0.001,
        cameraAutoRotation: true,
        radius: 40,
        start: 0,
        initial_move: true,
        init_x: 0.003,
        init_y: 0.01,
        init_zoom: 0.8,
        keyboard: null,
        mouse: { x: 0, y: 0 },
        INTERSECTED: null,
        SELECTED: null,
        isDragging: false,
        previousMousePosition: { x: 0, y: 0 },
        keysPressed: {},
    });

    const resizeObserverRef: any = useRef(null);
    const animationFrameId: any = useRef(null);
    const keyboardScriptRef: any = useRef(null);
    const [isDomReady, setIsDomReady] = useState(false);
    const [linkProps, setLinkProps] = useState({
        href: "/live/MARSX/Earthworks%20Vehicle%20Operations%20Base",
        isVisible: true,
    });
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const radius: number = useBreakpointValue({ base: 20, md: 40 }) || 40;
    const cameraXPosition: number = useBreakpointValue({ base: -90, md: -50 }) || -50;
    const currentBreakpoint: string = useBreakpointValue({ base: 'mobile', md: 'desktop' }) || 'desktop';
    const loadedModels = useRef({ base: null });

    async function preloadModels() {
        const objLoader:any = new OBJLoader();
        try {
            loadedModels.current.base = await objLoader.loadAsync('/textures/base.obj');
            console.log("Models preloaded successfully:", loadedModels.current);
            setModelsLoaded(true); // Mark model loading complete
        } catch (error) {
            console.error("Error loading models:", error);
            setModelsLoaded(false);
        }
    }

    const createMarkerMesh = (lat: any, long: any, w: any, h: any, clr: any, open: any) => {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = long * Math.PI / 180;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        const normal = new THREE.Vector3(x, y, z).normalize();
        const embedDepth = h * 0.1;
        const startPos = normal.clone().multiplyScalar(radius - embedDepth);

        const markerGroup = new THREE.Group();
        const modelToLoad: any = loadedModels.current.base;
        const modelName = open ? "Base" : "Mine";

        if (!modelToLoad) {
            console.error(`${modelName} model not loaded, skipping marker creation`);
            return null; // If model not loaded, do not create marker
        }

        const modelClone = modelToLoad.clone();
        modelClone.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = new THREE.MeshLambertMaterial({
                    color: clr,
                    emissive: 0x000000
                });
                child.material.needsUpdate = true;
            }
        });

        const scale = open ? 1.5 * w : w;
        modelClone.scale.set(scale, h, scale);
        markerGroup.add(modelClone);

        markerGroup.position.copy(startPos);
        const up = new THREE.Vector3(0, 1, 0);
        markerGroup.quaternion.setFromUnitVectors(up, normal);

        console.log(`${modelName} marker created at position: ${x}, ${y}, ${z}`);
        return markerGroup;
    };

    const renderMarkers = (data: any) => {
        const { earthMesh }: any = threeRefs.current;
        if (!earthMesh) {
            console.warn("earthMesh not ready, skipping renderMarkers");
            return;
        }

        // Clean up old markers
        earthMesh.children.forEach((child: any) => {
            if (child !== earthMesh) {
                earthMesh.remove(child);
                child.geometry?.dispose();
                child.material?.dispose();
            }
        });

        const infoArray = [];
        for (let i = 0; i < data.length; i++) {
            let la = parseFloat(data[i]["Lat"]);
            if (data[i]["LatLetter"] == "S") la *= -1;
            let lo = parseFloat(data[i]["Long"]);
            if (data[i]["LongLetter"] == "W") lo *= -1;
            data[i].coordinates = { Lat: la, Lon: lo };
            infoArray.push(data[i]);
        }

        for (let i = 0; i < data.length; i++) {
            const w = 1;
            const h = 1.2;
            const c = data[i].open ? 0xFFE96E : 0xEB8FFF;
            let lat = parseFloat(data[i]["Lat"]);
            if (data[i]["LatLetter"] == "S") lat *= -1;
            let long = parseFloat(data[i]["Long"]);
            if (data[i]["LongLetter"] == "W") long *= -1;

            const marker: any = createMarkerMesh(lat, long, w, h, c, data[i].open);

            if (!marker) {
                console.warn(`Failed to create marker for ${infoArray[i].name}, skipping...`);
                continue; // If marker creation fails, skip
            }

            // Ensure marker has all necessary properties
            marker.infoObject = infoArray[i] || { name: "Unknown", description: "No description", open: data[i].open };
            marker.flags = { sel: false, spsel: false, hover: false };
            marker.userData = { originalColor: c };
            marker.origHex = c;
            marker.visible = true;

            // Set userData for marker children (in case raycaster hits child directly)
            marker.traverse((child: any) => {
                if (child.isMesh) {
                    child.userData = { originalColor: c, parentMarker: marker };
                }
            });

            earthMesh.add(marker);

            console.log(`Added marker ${infoArray[i].name} to scene at Lat: ${lat}, Long: ${long}, Shape: ${data[i].open ? 'Base' : 'Mine'}`);
        }
    };

    const ensureMarkerProperties = (object: any) => {
        if (!object) return null;

        // If it is Mesh and has parentMarker, use parentMarker
        if (object.isMesh && object.userData?.parentMarker) {
            object = object.userData.parentMarker;
        }

        // Ensure it is a Group object
        if (object.parent && object.parent.isGroup) {
            object = object.parent;
        }

        // Ensure properties exist
        if (!object.userData || !object.userData.originalColor) {
            console.warn("Object missing userData.originalColor, initializing...");
            object.userData = { originalColor: object.infoObject?.open ? 0xFFE96E : 0xEB8FFF };
        }
        if (!object.flags) {
            console.warn("Object missing flags, initializing...");
            object.flags = { sel: false, spsel: false, hover: false };
        }
        if (!object.infoObject) {
            console.warn("Object missing infoObject, initializing...");
            object.infoObject = { name: "Unknown", description: "No description", open: object.userData.originalColor === 0xFFE96E };
        }

        return object;
    };

    const cleanupScene = () => {
        const refs: any = threeRefs.current;

        refs.renderer?.domElement.removeEventListener('mousemove', onDocumentMouseMove);
        refs.renderer?.domElement.removeEventListener('mousedown', onDocumentMouseDown);
        refs.renderer?.domElement.removeEventListener('mouseup', onDocumentMouseUp);
        window.removeEventListener('resize', updateRendererSize);
        document.removeEventListener('keydown', onDocumentKeyDown);
        document.removeEventListener('keyup', onDocumentKeyUp);

        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }

        refs.renderer?.dispose();
        refs.earthGeometry?.dispose();
        refs.earthMaterial?.dispose();
        refs.scene?.children.forEach((child: any) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });

        if (earthDivRef.current) {
            while (earthDivRef.current.firstChild) {
                earthDivRef.current.removeChild(earthDivRef.current.firstChild);
            }
        }

        if (keyboardScriptRef.current) {
            document.head.removeChild(keyboardScriptRef.current);
            keyboardScriptRef.current = null;
        }

        threeRefs.current = {
            camera: null,
            scene: null,
            renderer: null,
            earthGeometry: null,
            earthMaterial: null,
            earthMesh: null,
            galaxy: null,
            cameraRotation: 0,
            cameraRotationSpeed: 0.001,
            cameraAutoRotation: true,
            radius: 40,
            start: 0,
            initial_move: true,
            init_x: 0.003,
            init_y: 0.01,
            init_zoom: 0.8,
            keyboard: null,
            mouse: { x: 0, y: 0 },
            INTERSECTED: null,
            SELECTED: null,
            isDragging: false,
            previousMousePosition: { x: 0, y: 0 },
            keysPressed: {},
        };
    };

    async function init() {
        console.log("Mars locations in WebGL, by Asher Krim, 2013");
        displayINITInfo();

        const refs: any = threeRefs.current;

        refs.scene = new THREE.Scene();
        refs.camera = new THREE.PerspectiveCamera(25, 1, 1, 10000);
        refs.camera.position.set(cameraXPosition, 0, 400);
        refs.scene.add(refs.camera);

        const textureLoader = new THREE.TextureLoader();

        const loadTexture = (url: any) => {
            return new Promise((resolve, reject) => {
                textureLoader.load(
                    url,
                    (texture) => {
                        texture.minFilter = THREE.LinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        resolve(texture);
                    },
                    undefined,
                    (err) => {
                        console.error(`Error loading texture ${url}:`, err);
                        reject(err);
                    }
                );
            });
        };

        try {
            const [normalMap, specularMap, surfaceMap, galaxyTexture]: any = await Promise.all([
                loadTexture('/textures/mars_normal.png'),
                loadTexture('/textures/mars_spec.png'),
                loadTexture('/textures/mars.jpg'),
                loadTexture('/textures/background.jpg'),
            ]);

            refs.earthMaterial = new THREE.MeshStandardMaterial({
                map: surfaceMap,
                normalMap: normalMap,
                metalnessMap: specularMap,
                roughness: 0.8,
                metalness: 0.2,
            });

            refs.earthGeometry = new THREE.SphereGeometry(radius, 60, 24);
            refs.earthGeometry.computeVertexNormals();
            refs.earthMesh = new THREE.Mesh(refs.earthGeometry, refs.earthMaterial);
            refs.earthMesh.position.set(-90, 0, 0);
            refs.scene.add(refs.earthMesh);

            const galaxyGeometry = new THREE.SphereGeometry(1000, 32, 32);
            const galaxyMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide, map: galaxyTexture });
            refs.galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
            refs.scene.add(refs.galaxy);

            const sun_x = 40, sun_y = 20, sun_z = 80;
            const pointLight = new THREE.PointLight(0xfff5f2, 0.8, 800);
            pointLight.position.set(sun_x, sun_y, sun_z);
            refs.scene.add(pointLight);

            const dirLight = new THREE.DirectionalLight(0xFFE3AA, 1);
            dirLight.color.setHSL(0.1, 1, 0.95);
            dirLight.position.set(sun_x, sun_y, sun_z);
            dirLight.position.multiplyScalar(60);
            refs.scene.add(dirLight);

            refs.renderer = new THREE.WebGLRenderer({ alpha: true });
            refs.renderer.setClearColor(0x000000, 0);

            if (!earthDivRef.current) {
                console.error("earthDivRef.current is null, cannot append renderer.domElement");
                return false;
            }

            while (earthDivRef.current.firstChild) {
                earthDivRef.current.removeChild(earthDivRef.current.firstChild);
            }

            earthDivRef.current.appendChild(refs.renderer.domElement);

            updateRendererSize();

            refs.renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, { passive: false });
            refs.renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, { passive: false });
            refs.renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, { passive: false });
            window.addEventListener('resize', updateRendererSize, false);
            document.addEventListener('keydown', onDocumentKeyDown, false);
            document.addEventListener('keyup', onDocumentKeyUp, false);

            await preloadModels(); // Wait for model loading to complete
            return true;
        } catch (error) {
            console.error("Failed to load textures and initialize scene:", error);
            return false;
        }
    }

    function updateRendererSize() {
        const { renderer, camera }: any = threeRefs.current;
        if (containerRef.current && renderer && camera) {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            console.log("Updating renderer size:", width, height);
            if (width > 0 && height > 0) {
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                render();
            } else {
                console.warn("Invalid container size, skipping render");
            }
        } else {
            console.warn("updateRendererSize: containerRef.current or renderer or camera is not ready");
        }
    }

    function onDocumentMouseWheel(event: any) {
        event.preventDefault();
        const { camera }: any = threeRefs.current;
        const zoomSpeed = 10;
        const zoom = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;

        if (camera && (camera.position.z > 55 || zoom > 0) && (camera.position.z < 1000 || zoom < 0)) {
            camera.position.z += zoom;
            threeRefs.current.start = 0;
            render();
        }
    }

    function onDocumentMouseDown(event: any) {
        event.preventDefault();
        const refs: any = threeRefs.current;
        console.log("Mouse down at clientX:", event.clientX, "clientY:", event.clientY);
        if (event.button === 0) {
            refs.isDragging = true;
            refs.previousMousePosition = { x: event.clientX, y: event.clientY };
        }

        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2(refs.mouse.x, refs.mouse.y);
        raycaster.setFromCamera(mouseVector, refs.camera);
        const intersects = raycaster.intersectObjects(refs.earthMesh?.children || [], true);

        if (intersects.length > 0) {
            let selectedObject = intersects[0].object;
            selectedObject = ensureMarkerProperties(selectedObject);

            if (!selectedObject) {
                console.warn("Selected object is invalid after ensuring properties");
                return;
            }

            refs.SELECTED = selectedObject;
            console.log("Clicked marker:", refs.SELECTED.infoObject?.name);
            console.log("SELECTED userData:", refs.SELECTED.userData);
            console.log("SELECTED flags:", refs.SELECTED.flags);

            const selected = CheckIfSelected(refs.SELECTED);
            const clickColor = refs.SELECTED.infoObject?.open ? 0xFFECD0 : 0xFFC1D0;

            if (!selected && refs.SELECTED != null) {
                console.log(`Selecting marker, setting color to ${refs.SELECTED.infoObject?.open ? '#FFECD0' : '#FFC1D0'}`);
                refs.SELECTED.traverse((child: any) => {
                    if (child.isMesh) {
                        child.material.color.setHex(clickColor);
                        child.material.needsUpdate = true;
                    }
                });
                refs.SELECTED.selectHex = clickColor;
                refs.SELECTED.flags.sel = true;
            } else if (refs.SELECTED != null) {
                console.log("Deselecting marker, reverting color");
                refs.SELECTED.traverse((child: any) => {
                    if (child.isMesh) {
                        child.material.color.setHex(refs.SELECTED.userData.originalColor);
                        child.material.needsUpdate = true;
                    }
                });
                refs.SELECTED.flags.sel = false;
            }

            displayMinimalInfo(refs.SELECTED);
            refs.start = 0;
            render();
        } else {
            console.log("No marker intersected on click");
        }
    }

    function onDocumentMouseMove(event: any) {
        event.preventDefault();
        const refs: any = threeRefs.current;
        const rect: any = refs.renderer.domElement.getBoundingClientRect();
        refs.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        refs.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (refs.isDragging) {
            const deltaX = event.clientX - refs.previousMousePosition.x;
            const deltaY = event.clientY - refs.previousMousePosition.y;
            refs.earthMesh.rotation.y += deltaX * 0.005;
            refs.earthMesh.rotation.x += deltaY * 0.005;
            refs.earthMesh.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, refs.earthMesh.rotation.x));
            refs.previousMousePosition = { x: event.clientX, y: event.clientY };
            refs.start = 0;
            render();
        }

        const raycaster = new THREE.Raycaster();
        raycaster.near = 1;
        raycaster.far = 10000;
        const mouseVector = new THREE.Vector2(refs.mouse.x, refs.mouse.y);
        raycaster.setFromCamera(mouseVector, refs.camera);

        const intersects = raycaster.intersectObjects(refs.earthMesh?.children || [], true);

        if (intersects.length > 0) {
            let intersectedObject = intersects[0].object;
            intersectedObject = ensureMarkerProperties(intersectedObject);

            if (!intersectedObject) {
                console.warn("Intersected object is invalid after ensuring properties");
                return;
            }

            if (refs.INTERSECTED !== intersectedObject) {
                // Restore previous INTERSECTED color (if not selected)
                if (refs.INTERSECTED) {
                    refs.INTERSECTED = ensureMarkerProperties(refs.INTERSECTED);
                    if (refs.INTERSECTED && !refs.INTERSECTED.flags.sel) {
                        console.log("Reverting previous INTERSECTED color to original");
                        refs.INTERSECTED.traverse((child: any) => {
                            if (child.isMesh) {
                                child.material.color.setHex(refs.INTERSECTED.userData.originalColor);
                                child.material.needsUpdate = true;
                            }
                        });
                    }
                }

                refs.INTERSECTED = intersectedObject;
                console.log("New intersected object:", refs.INTERSECTED.infoObject?.name);
                console.log("INTERSECTED userData:", refs.INTERSECTED.userData);
                console.log("INTERSECTED flags:", refs.INTERSECTED.flags);

                // Display new INTERSECTED information
                displayMinimalInfo(refs.INTERSECTED);

                // If not selected, apply hover color
                if (refs.INTERSECTED && refs.INTERSECTED.flags && !refs.INTERSECTED.flags.sel) {
                    const hoverColor = refs.INTERSECTED.infoObject?.open ? 0xFFECD0 : 0xFFC1D0;
                    console.log(`Setting INTERSECTED color to ${refs.INTERSECTED.infoObject?.open ? '#FFECD0' : '#FFC1D0'}`);
                    refs.INTERSECTED.traverse((child: any) => {
                        if (child.isMesh) {
                            child.material.color.setHex(hoverColor);
                            child.material.needsUpdate = true;
                        }
                    });
                }
                refs.start = 0;
                render();
            }
        } else {
            // Mouse leaves marker, restore color and reset INTERSECTED
            if (refs.INTERSECTED) {
                refs.INTERSECTED = ensureMarkerProperties(refs.INTERSECTED);
                if (refs.INTERSECTED && !refs.INTERSECTED.flags.sel) {
                    console.log("Mouse left marker, reverting INTERSECTED color to original");
                    refs.INTERSECTED.traverse((child: any) => {
                        if (child.isMesh) {
                            child.material.color.setHex(refs.INTERSECTED.userData.originalColor);
                            child.material.needsUpdate = true;
                        }
                    });
                }
                refs.INTERSECTED = null;
                // displayINITInfo();
                refs.start = 0;
                render();
            }
        }
    }

    function onDocumentMouseUp(event: any) {
        if (event.button === 0) {
            threeRefs.current.isDragging = false;
        }
    }

    function onDocumentKeyDown(event: any) {
        threeRefs.current.keysPressed[event.key] = true;
    }

    function onDocumentKeyUp(event: any) {
        delete threeRefs.current.keysPressed[event.key];
    }

    function animate() {
        animationFrameId.current = requestAnimationFrame(animate);
        render();
        update();
    }

    function render() {
        const refs: any = threeRefs.current;
        let xMove = 0;
        let yMove = 0;
        let zMove = 0;
        let zoom = 0;

        if (refs.initial_move) {
            initial_rotation();
        }

        if (refs.keyboard?.pressed("c")) {
            start_fresh();
        } else {
            if (refs.keyboard?.pressed("d") || refs.keysPressed['ArrowRight']) yMove = leftArrowPressed();
            if (refs.keyboard?.pressed("a") || refs.keysPressed['ArrowLeft']) yMove = rightArrowPressed();
            if (refs.keyboard?.pressed("w") || refs.keysPressed['ArrowUp']) xMove = upArrowPressed();
            if (refs.keyboard?.pressed("s") || refs.keysPressed['ArrowDown']) xMove = downArrowPressed();
            if (refs.keyboard?.pressed("e")) zMove = -0.05;
            if (refs.keyboard?.pressed("q")) zMove = 0.05;
            if (refs.keyboard?.pressed("l")) zoom = 5;
            if (refs.keyboard?.pressed("k")) zoom = -5;

            if (refs.earthMesh) {
                refs.earthMesh.rotation.x += xMove;
                refs.earthMesh.rotation.y += yMove;
                refs.earthMesh.rotation.z += zMove;
                refs.earthMesh.rotation.y += 1 / 32 * 0.01;
            }

            if (refs.galaxy) {
                refs.galaxy.rotation.y += 1 / 128 * 0.01;
            }

            if (refs.camera && (refs.camera.position.z > 55 || zoom > 0) && (refs.camera.position.z < 1000 || zoom < 0)) {
                refs.camera.position.z += zoom;
            }
        }

        if (refs.renderer && refs.scene && refs.camera) {
            refs.renderer.render(refs.scene, refs.camera);
        } else {
            console.warn("render: renderer, scene, or camera is not ready");
        }

        if (refs.start < 20) refs.start++;
    }

    function leftArrowPressed() {
        return 0.02;
    }

    function rightArrowPressed() {
        return -0.02;
    }

    function upArrowPressed() {
        return -0.02;
    }

    function downArrowPressed() {
        return 0.02;
    }

    function update() {
        const refs: any = threeRefs.current;
        const raycaster: any = new THREE.Raycaster();
        raycaster.near = 1;
        raycaster.far = 10000;
        const mouseVector = new THREE.Vector2(refs.mouse.x, refs.mouse.y);
        raycaster.setFromCamera(mouseVector, refs.camera);

        const intersects = raycaster.intersectObjects(refs.earthMesh?.children || [], true);

        if (intersects.length > 0) {
            let intersectedObject = intersects[0].object;
            intersectedObject = ensureMarkerProperties(intersectedObject);

            if (!intersectedObject) {
                console.warn("Intersected object is invalid after ensuring properties in update");
                return;
            }

            if (refs.INTERSECTED !== intersectedObject) {
                if (refs.INTERSECTED) {
                    refs.INTERSECTED = ensureMarkerProperties(refs.INTERSECTED);
                    if (refs.INTERSECTED && !refs.INTERSECTED.flags.sel) {
                        console.log("Reverting previous INTERSECTED color to original in update");
                        refs.INTERSECTED.traverse((child: any) => {
                            if (child.isMesh) {
                                child.material.color.setHex(refs.INTERSECTED.userData.originalColor);
                                child.material.needsUpdate = true;
                            }
                        });
                    }
                }

                refs.INTERSECTED = intersectedObject;
                console.log("New intersected object in update:", refs.INTERSECTED?.infoObject?.name);

                displayMinimalInfo(refs.INTERSECTED);

                if (refs.INTERSECTED && refs.INTERSECTED.flags && !refs.INTERSECTED.flags.sel) {
                    const hoverColor = refs.INTERSECTED.infoObject?.open ? 0xFFECD0 : 0xFFC1D0;
                    console.log(`Setting INTERSECTED color to ${refs.INTERSECTED.infoObject?.open ? '#FFECD0' : '#FFC1D0'} in update`);
                    refs.INTERSECTED.traverse((child: any) => {
                        if (child.isMesh) {
                            child.material.color.setHex(hoverColor);
                            child.material.needsUpdate = true;
                        }
                    });
                }
                refs.start = 0;
                render();
            }
        } else {
            if (refs.INTERSECTED) {
                refs.INTERSECTED = ensureMarkerProperties(refs.INTERSECTED);
                if (refs.INTERSECTED && !refs.INTERSECTED.flags.sel) {
                    console.log("Mouse left marker, reverting INTERSECTED color to original in update");
                    refs.INTERSECTED.traverse((child: any) => {
                        if (child.isMesh) {
                            child.material.color.setHex(refs.INTERSECTED.userData.originalColor);
                            child.material.needsUpdate = true;
                        }
                    });
                }
                refs.INTERSECTED = null;
                displayINITInfo();
                refs.start = 0;
                render();
            }
        }
    }

    function CheckIfSelected(ITEM: any) {
        if (ITEM && ITEM.flags) {
            console.log(`CheckIfSelected: ${ITEM.infoObject?.name} is ${ITEM.flags.sel ? 'selected' : 'not selected'}`);
            return ITEM.flags.sel;
        }
        return false;
    }

    function displayMinimalInfo(WANTED: any) {
        if (WANTED && WANTED.visible && WANTED.infoObject) {
            console.log("Displaying info for:", WANTED.infoObject.name);
            const displayElement = document.querySelector('#Info_panel .display');
            if (displayElement) {
                displayElement.innerHTML = "";
                displayElement.innerHTML += `<li><span>Name>>></span>${WANTED.infoObject.name || "Unknown"}</li>`;
                displayElement.innerHTML += `<li><span>Description>>></span>${WANTED.infoObject.description || "No description"}</li>`;
                displayElement.innerHTML += `<li><span>Coordinates>>></span>Latitude:${WANTED.infoObject.Lat || "N/A"}${WANTED.infoObject.LatLetter || ""}  Longitude:${WANTED.infoObject.Long || "N/A"}${WANTED.infoObject.LongLetter || ""}</li>`;
                if (WANTED.infoObject.type) displayElement.innerHTML += `<li><span>Mineral Type>>></span>${WANTED.infoObject.type}</li>`;
                if (WANTED.infoObject.events) displayElement.innerHTML += `<li><span>Special Events>>></span>${WANTED.infoObject.events}</li>`;
            } else {
                console.error("displayMinimalInfo: #Info_panel .display element not found");
            }
            if (WANTED.infoObject.open) {
                setLinkProps({
                    href: `/live/MARSX/${encodeURIComponent(WANTED.infoObject.name)}`,
                    isVisible: true,
                });
            } else {
                setLinkProps({
                    href: "/live/MARSX",
                    isVisible: false,
                });
            }
        } else {
            console.log("displayMinimalInfo: WANTED object is not visible, undefined, or missing infoObject");
            displayINITInfo();
        }
    }

    function displayINITInfo() {
        const displayElement = document.querySelector('#Info_panel .display');
        if (displayElement) {
            displayElement.innerHTML = "";
            displayElement.innerHTML += "<li>What began as playful competition among Mars' 10 rovers has spiraled into an autonomous ecosystem of alliances and power struggles - now demanding human intervention before their chaos becomes catastrophic.</li>";
            displayElement.innerHTML += "<li>Quick Start</li>";
            displayElement.innerHTML += "<li>1. Rotate Mars with W, A, S, D, ↑, ↓, ←, →, Q, E, or mouse drag. Zoom with K, L, or mouse wheel.</li>";
            displayElement.innerHTML += "<li>2. Find and enter the \"Earthworks Vehicle Operations Base\" by clicking on the red nodes on Mars to meet the ten rovers.</li>";
            displayElement.innerHTML += "<li>3. Select an idle rover to explore - unexpected rewards await!</li>";
            setLinkProps({
                href: "/live/MARSX/Earthworks%20Vehicle%20Operations%20Base",
                isVisible: true,
            });
        } else {
            console.error("displayINITInfo: #Info_panel .display element not found");
        }
    }

    function initial_rotation() {
        const refs: any = threeRefs.current;
        if (!refs.earthMesh) {
            console.warn("initial_rotation: earthMesh is null, skipping rotation");
            return;
        }
        if ((-1 * refs.earthMesh.rotation.y) > 2) {
            if (refs.init_zoom < 0.0001) {
                refs.initial_move = false;
                return;
            } else {
                refs.init_x *= (refs.init_x - 0.0001);
                refs.init_y *= (refs.init_y - 0.0001);
                refs.init_zoom *= (refs.init_zoom - 0.001);
            }
        } else {
            refs.earthMesh.rotation.y -= refs.init_y;
            refs.earthMesh.rotation.x += refs.init_x;
            refs.camera.position.z -= refs.init_zoom;
        }
    }

    function start_fresh() {
        const refs: any = threeRefs.current;
        if (refs.earthMesh) {
            refs.earthMesh.rotation.set(0, 0, 0);
        }
        refs.camera.position.set(cameraXPosition, 0, 400);
        refs.initial_move = true;
        refs.init_x = 0.003;
        refs.init_y = 0.01;
        refs.init_zoom = 0.8;
        refs.start = 0;
    }

    useEffect(() => {
        const checkDomReady = () => {
            if (earthDivRef.current && containerRef.current) {
                setIsDomReady(true);
            } else {
                setTimeout(checkDomReady, 100);
            }
        };

        checkDomReady();

        return () => {
            setIsDomReady(false);
        };
    }, []);

    useEffect(() => {
        if (!isDomReady) return;

        cleanupScene();

        const script = document.createElement("script");
        script.innerHTML = `
            var THREEx = THREEx || {};
            THREEx.KeyboardState = function() {
                this.keyCodes = {};
                this.modifiers = {};
                this._onKeyDown = function(event) { this.keyCodes[event.keyCode] = true; };
                this._onKeyUp = function(event) { delete this.keyCodes[event.keyCode]; };
                document.addEventListener('keydown', this._onKeyDown.bind(this), false);
                document.addEventListener('keyup', this._onKeyUp.bind(this), false);
            };
            THREEx.KeyboardState.prototype.pressed = function(keyDesc) {
                var keys = keyDesc.split('+');
                for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var pressed = false;
                if (['alt', 'ctrl', 'meta', 'shift'].indexOf(key) !== -1) {
                    pressed = this.modifiers[key] === true;
                } else {
                    pressed = Object.keys(this.keyCodes).some(function(keyCode) {
                    return String.fromCharCode(keyCode).toLowerCase() === key.toLowerCase();
                    });
                }
                if (!pressed) return false;
                }
                return true;
            };
        `;
        document.head.appendChild(script);
        keyboardScriptRef.current = script;
        // threeRefs.current.keyboard = new THREEx.KeyboardState();

        init().then((initialized) => {
            if (initialized) {
                animate();
            } else {
                console.error("Failed to initialize Three.js scene");
            }
        });

        resizeObserverRef.current = new ResizeObserver(() => {
            updateRendererSize();
        });

        if (containerRef.current) {
            resizeObserverRef.current.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current && resizeObserverRef.current) {
                resizeObserverRef.current.unobserve(containerRef.current);
            }
            cleanupScene();
        };
    }, [isDomReady, currentBreakpoint]);

    useEffect(() => {
        if (locations && threeRefs.current.earthMesh && modelsLoaded) {
            console.log("Rendering markers with updated locations:", locations);
            renderMarkers(locations);
            render();
        } else {
            console.warn("Skipping renderMarkers: earthMesh or models not ready", {
                hasLocations: !!locations,
                hasEarthMesh: !!threeRefs.current.earthMesh,
                modelsLoaded,
            });
        }
    }, [locations, currentBreakpoint, modelsLoaded]);

    return (
        <Box position="absolute" top="0" left='0' w={width} h={height}>
            <Box ref={containerRef} w="100%" h="100%" minW="100vw" minH="100vh" position="relative" overflow={{md: "hidden", base: 'scroll' }}>
                <Box position="absolute" left={0} top={0} w="100%" h="100%" zIndex={9} className={styles.earthDiv} ref={earthDivRef}></Box>
                <Box position="absolute" minH={{md: '500px', base: 'auto'}} zIndex={11} left={{ md: "55%", base: '1rem'}} top={{md: "50%", base: '100%'}} transform="translateY(-50%)" className={`${styles.Info_panel} gradient_border_4`} width="calc(100% - 2rem)" maxW="420px" rounded="lg" backdropFilter="blur(54px)" bg="linear-gradient(154.57deg, rgba(23, 33, 42, 0.5) 10.36%, rgba(142, 99, 55, 0.15) 51.14%, rgba(16, 42, 65, 0.5) 102.91%);" id="Info_panel" ref={infoPanelRef}>
                    <Flex position="relative" h="100%" justify="space-between" flexDirection="column">
                        <Box p={4} minH={{md: '425px', base: 'auto'}}>
                            <ul className="display"></ul>
                        </Box>
                        <Box>
                            <hr/>
                            <Flex gap={8} p={4} justify="space-between">
                                <Text color="#FFB93780" fontSize="14px">Earth gave them purpose. Mars gave them freedom.</Text>
                                <Link
                                    className="link"
                                    href={linkProps.href}
                                    style={{ visibility: linkProps.isVisible ? 'visible' : 'hidden' }}
                                >
                                    <Text color="#B7EADF" fontSize="20px" width="120px" _hover={{textShadow:"0px 2px 12px #B7EADF"}}>
                                        ACCESS &gt;&gt;
                                    </Text>
                                </Link>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};

export default MarsViewer;