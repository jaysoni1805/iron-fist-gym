import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'

function Dumbbell3D() {
    return (
        <group rotation={[0, 0, 0]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 3.2, 16]} />
                <meshStandardMaterial color="#666" metalness={1} roughness={0.1} />
            </mesh>
            <group position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh position={[0, 0.15, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
                    <meshStandardMaterial color="#ff0033" metalness={0.7} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
            <group position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh position={[0, -0.15, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
                    <meshStandardMaterial color="#ff0033" metalness={0.7} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
                <meshStandardMaterial color="#222" metalness={0.5} roughness={0.8} />
            </mesh>
        </group>
    )
}

export default function DumbbellScene() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <pointLight position={[-3, -3, -3]} color="#ff0033" intensity={2} />
            <pointLight position={[3, 3, 0]} color="#ffffff" intensity={0.5} />
            <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
                <Dumbbell3D />
            </Float>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
        </Canvas>
    )
}
