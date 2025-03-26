"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface CandlestickChartProps {
  asset: string;
  view: "2d" | "3d";
}

// Données simulées
const generateMockData = (count: number) => {
  const data = [];
  let price = 50000;
  
  for (let i = 0; i < count; i++) {
    const open = price;
    const close = open * (1 + (Math.random() * 0.1 - 0.05));
    const high = Math.max(open, close) * (1 + Math.random() * 0.03);
    const low = Math.min(open, close) * (1 - Math.random() * 0.03);
    
    data.push({ time: i, open, high, low, close, volume: Math.random() * 100 });
    price = close;
  }
  
  return data;
};

export function CandlestickChart({ asset, view }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Nettoyer le conteneur avant de créer un nouveau renderer
    if (rendererRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
      containerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
    
    // Initialisation de Three.js
    const width = containerRef.current.clientWidth || 800;  // Valeur par défaut si width est 0
    const height = containerRef.current.clientHeight || 500; // Valeur par défaut si height est 0
    
    console.log(`Initializing chart for ${asset} with dimensions: ${width}x${height}`);
    
    // Création du renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true  // Permet la transparence du fond
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a0a1a, 1); // Fond bleu-noir avec opacité complète
    renderer.setPixelRatio(window.devicePixelRatio); // Pour les écrans haute résolution
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Création de la scène
    const scene = new THREE.Scene();
    // Brouillard léger pour ajouter de la profondeur
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.025);
    sceneRef.current = scene;
    
    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, view === "3d" ? 25 : 10);
    
    // Ajout des contrôles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    
    // Ajout de lumière
    const ambientLight = new THREE.AmbientLight(0x4c6584, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x6382ff, 1.2);
    directionalLight.position.set(5, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Ajouter des points de lumière pour un effet plus dynamique
    const pointLight1 = new THREE.PointLight(0x6382ff, 1, 40);
    pointLight1.position.set(-10, 10, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff6b6b, 0.8, 40);
    pointLight2.position.set(10, 8, 5);
    scene.add(pointLight2);
    
    // Création des chandeliers
    const candlestickData = generateMockData(30);
    
    // Ajout d'un plan de base avec une grille
    const gridSize = 60;
    const gridDivisions = 60;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x6382ff, 0x162447);
    gridHelper.position.y = -7;
    scene.add(gridHelper);
    
    // Plan réfléchissant
    const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x162447,
      roughness: 0.4,
      metalness: 0.7,
      transparent: true,
      opacity: 0.4,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -7.1;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // Création des chandeliers avec des barres plus visibles
    candlestickData.forEach((candle, i) => {
      const isGreen = candle.close > candle.open;
      // Couleurs plus vives pour les bougies - vert et rouge néon
      const color = isGreen ? 0x00ff7f : 0xff3060;
      const emissiveColor = isGreen ? 0x00a74d : 0xc41e3a;
      
      // Corps du chandelier
      const bodyHeight = Math.max(Math.abs(candle.close - candle.open) * 0.1, 0.1); // Hauteur minimale
      const bodyGeometry = new THREE.BoxGeometry(0.9, bodyHeight, view === "3d" ? 0.9 : 0.2);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: emissiveColor,
        emissiveIntensity: 0.5,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      
      const bodyY = ((candle.close + candle.open) / 2) * 0.1;
      body.position.set(i - 15, bodyY, 0);
      body.castShadow = true;
      body.receiveShadow = true;
      
      // Mèche
      const wickHeight = Math.max((candle.high - candle.low) * 0.1, 0.2); // Hauteur minimale
      const wickGeometry = new THREE.BoxGeometry(0.15, wickHeight, 0.15);
      const wickMaterial = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.3,
        metalness: 0.5,
        emissive: emissiveColor,
        emissiveIntensity: 0.3,
      });
      const wick = new THREE.Mesh(wickGeometry, wickMaterial);
      
      const wickY = ((candle.high + candle.low) / 2) * 0.1;
      wick.position.set(i - 15, wickY, 0);
      wick.castShadow = true;
      
      scene.add(body);
      scene.add(wick);
      
      // Ajout du volume en 3D
      if (view === "3d") {
        const volumeHeight = Math.max(candle.volume * 0.03, 0.1); // Hauteur minimale
        const volumeGeometry = new THREE.BoxGeometry(0.9, volumeHeight, 0.9);
        const volumeMaterial = new THREE.MeshStandardMaterial({ 
          color, 
          transparent: true, 
          opacity: 0.7,
          roughness: 0.7,
          metalness: 0.3,
          emissive: emissiveColor,
          emissiveIntensity: 0.2,
        });
        const volume = new THREE.Mesh(volumeGeometry, volumeMaterial);
        volume.position.set(i - 15, -5, 0);
        volume.castShadow = true;
        volume.receiveShadow = true;
        scene.add(volume);
        
        // Ligne connectant le volume au chandelier pour plus de clarté
        const lineGeometry = new THREE.BoxGeometry(0.05, bodyY - (-5) - (bodyHeight/2) - (volumeHeight/2), 0.05);
        const lineMaterial = new THREE.MeshStandardMaterial({
          color: 0x6382ff,
          transparent: true,
          opacity: 0.3,
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(i - 15, (bodyY + (-5)) / 2, 0);
        scene.add(line);
      }
    });
    
    // Ajouter des lignes de tendance ou des indicateurs
    const addTrendLine = () => {
      const points = [];
      // Créer une ligne de tendance simpliste basée sur les prix de fermeture
      for (let i = 0; i < candlestickData.length; i++) {
        points.push(new THREE.Vector3(i - 15, candlestickData[i].close * 0.1, 0));
      }
      
      const material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const trendLine = new THREE.Line(geometry, material);
      scene.add(trendLine);
    };
    
    if (view === "2d") {
      addTrendLine();
    }
    
    // Orientation initiale pour une meilleure visualisation
    if (view === "3d") {
      camera.position.set(-15, 15, 20);
      controls.update();
    } else {
      camera.position.set(0, 0, 20);
      controls.update();
    }
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Animation des lumières pour un effet dynamique
      const time = Date.now() * 0.001;
      pointLight1.position.x = Math.sin(time * 0.3) * 15;
      pointLight1.position.z = Math.cos(time * 0.2) * 15;
      pointLight2.position.x = Math.sin(time * 0.3 + Math.PI) * 15;
      pointLight2.position.z = Math.cos(time * 0.2 + Math.PI) * 15;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Adapter la taille en cas de redimensionnement
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 500;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Déclenchez un redimensionnement initial après un court délai
    // pour s'assurer que le conteneur a les bonnes dimensions
    setTimeout(handleResize, 100);
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Nettoyer la scène
      if (scene) {
        while(scene.children.length > 0) { 
          const object = scene.children[0];
          scene.remove(object);
        }
      }
      
      renderer.dispose();
      controls.dispose();
    };
  }, [asset, view]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-lg overflow-hidden" 
      style={{ minHeight: '500px' }} // Hauteur minimale pour s'assurer que le graphique est visible
    />
  );
}
