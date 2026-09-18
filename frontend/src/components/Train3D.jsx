import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Train() {
  return (
    <group>

      {/* Main locomotive body */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[4, 1.4, 1.5]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>

      {/* Front nose */}
      <mesh position={[2.15, 1.2, 0]}>
        <boxGeometry args={[0.5, 1.1, 1.4]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Driver cabin */}
      <mesh position={[-1.1, 2.1, 0]}>
        <boxGeometry args={[1.5, 1.0, 1.4]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>

      {/* Cabin windows */}
      <mesh position={[-1.1, 2.15, 0.72]}>
        <boxGeometry args={[0.8, 0.45, 0.05]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      <mesh position={[-1.1, 2.15, -0.72]}>
        <boxGeometry args={[0.8, 0.45, 0.05]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* Roof */}
      <mesh position={[-1.1, 2.65, 0]}>
        <boxGeometry args={[1.8, 0.2, 1.6]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Headlight */}
      <mesh position={[2.42, 1.5, 0]}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial
          color="yellow"
          emissive="yellow"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Front bumper */}
      <mesh position={[2.4, 0.75, 0]}>
        <boxGeometry args={[0.15, 0.2, 1.3]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Wheels */}
      {[[-1.3, 0.55, 0.8], [1.3, 0.55, 0.8],
        [-1.3, 0.55, -0.8], [1.3, 0.55, -0.8]].map(
        ([x, y, z], index) => (
          <mesh
            key={index}
            position={[x, y, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.38, 0.38, 0.22, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
        )
      )}

    </group>
  );
}
function Track() {
  return (
    <group>
      {/* Rails */}
      <mesh position={[0, 0, 0.7]}>
        <boxGeometry args={[20, 0.15, 0.12]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <mesh position={[0, 0, -0.7]}>
        <boxGeometry args={[20, 0.15, 0.12]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Sleepers */}
      {Array.from({ length: 15 }).map((_, index) => (
        <mesh
          key={index}
          position={[-9 + index * 1.3, -0.08, 0]}
        >
          <boxGeometry args={[0.35, 0.15, 2]} />
          <meshStandardMaterial color="brown" />
        </mesh>
      ))}
    </group>
  );
}

function Train3D() {
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <Canvas
  camera={{
    position: [8, 6, 10],
    fov: 50,
  }}
>
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={2}
        />

        <Train />

        <Track />

        <OrbitControls
  target={[0, 1, 0]}
  enableDamping
  minDistance={5}
  maxDistance={25}
/>
      </Canvas>
    </div>
  );
}

export default Train3D;