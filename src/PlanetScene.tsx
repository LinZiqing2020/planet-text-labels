import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './PlanetScene.css';

const radius = 5;

// 模拟数据
const users = [
  '企业官网', '工商信息', '1688', '赶集网', '企业通', '高德地图', '百度地图', '腾讯地图',
  '城市吧街景地图', '图吧地图', '搜狗地图', '58同城', '前程无忧', '智联招聘', '猎聘网',
  '看准网', 'boss直聘', '河北省招标投标公共服务平台', '江苏省公共资源交易中心',
  '宜昌市公共资源交易中心', '朔州市公共资源交易中心', '北京市公共资源交易服务平台',
  '全国公共资源交易平台', '上海政府采购网', '广东省政府采购网', '浙江政府采购网',
  '四川政府采购网', '江西省公共资源交易网', '山东政府采购网', '海南省政府采购网',
  '重庆市政府采购网', '陕西省政府采购网', '江苏政府采购网', '广西政府采购网',
  '河南省政府采购网', '宁夏公共资源交易管理局', '湖北公共资源交易平台',
  '云南省政府采购网', '内蒙古自治区政府采购网', '河北省政府采购网',
  '新疆公共资源交易网', '四川省公共资源交易信息网', '机电产品招投标电子交易平台',
  '中国公共招聘网', '中华人民共和国工业和信息化部', '全国排污许可证管理信息平台',
  '中国博物馆及相关产品与技术展览馆', '展览库', '网纵会展网', 'E展会',
  'MICEGZ广州会展', 'CNENA展会', '中国(漯河)食品博览会', '盘古机械网(会展)', '汇展在线',
  '黄页88', '会搜网', '慧聪网', '金安发', '马可波罗网', '企领网', '速速网', '德客易行网',
  '胖窝网', '广商网', '搜好货网', '勤发网', '比途黄页', '一线网', '维库', '中国网库',
  '全天候贸易网', '商务联盟', '搜了网', '我帮网', '一比多', '一呼百应网', '职友集',
  '中国黄页', '中国制造交易网', '中华企业录网', '众加商贸网', '中国商务网', '书生商务网',
  'E路网', '国际贸易网', '71铺黄页网', '168商务网', '勤财网', '企聚网', '中国制造网',
  '慧聚中国网', '赛门国际', '东商网', 'U88加盟', '商国互联网', '商路通', '万行商业城网',
  '钱眼', '商名网', '际通宝网', '企业供需库', '品牌之家', '十环网', '114批发网', '虎易网',
  '微商铺', '悠牛网', '企讯网', '自助贸易', '华南城网', '中国麦网', '中国企业链',
  '007商务站', '切它网', '万商汇', '企业谷', '企汇网', '商虎中国', '商牌网', '光波网',
  '中外玩具网', '变宝网', '帝商网', '全球汽配网', '志趣网', '中国电子商务网', '商录',
  '全球机械网', '环球贸易网', 'LED网', '工业信息网', '中国服装网', '华强电子网',
  '药品咨询网', '百方网', '中国纺织网', '装一网', '大拇指商务网', '行业信息网', '生意宝',
  '天助网', '环球经贸网', '拉销网', '互联网服务平台', '淘金地', '找找去', '房天下',
  '百姓网', '号码百事通', '查电话', '必联网', '中国政府采购网', '搜才网', '企业梦工厂',
  '置顶吧', '新品快播网', '3158创业信息网', '东方供应', '国联资源', '书生商务', '叫卖网',
  '世界工厂', '首商网', '浙江民营企业网', '100招商网', '云商网', '39企业网', '万国企业网',
  '环球贸易网', '中国贸易网', '第一枪网', '无忧商务网', '亿商网', '当今商务网', '城际分类',
  '中国花木网', '华人螺丝网', '中国农业网', '爱喇叭网', '中国自动化网', '中国化工机械网', '建材在线', '中国园林网', '中国汽配网', '全球阀门网', '天成医疗网', '中国电动车网', '中国木业信息网', '青青花木网', '盛丰建材网', '医疗器械网', '环球塑化网', '易发五金网', '化工设备网', '康泽医械网', '环保在线', '九正建筑网', '维库仪器网', '建材采购网', '园林网', '证券之星', '建筑之家', '华律网',
  '列表网', '56114物流查询网',
]

const mockUsers = users.map((item, index) => ({
  id: index,
  name: item,
  color: Math.random() > 0.5 ? '#383645' : '#7859F6'
  // color: new THREE.Color(Math.random(), Math.random(), Math.random()).getStyle(),
}));

const userPoints = mockUsers.map((user, i) => {
  const phi = Math.acos(1 - 2 * (i + 0.5) / mockUsers.length);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
  return {
    id: user.id,
    position: [x, y, z] as [number, number, number],
    color: user.color,
    name: user.name,
  };
});

function Planet() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {userPoints.map((user) => (
        <group key={user.id} position={user.position}>
          <TextLabel text={user.name} color={user.color} />
        </group>
      ))}
    </group>
  );
}

function TextLabel({ text, color }: { text: string; color: string }) {
  const canvas = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, size, size);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);
    return canvas;
  }, [text, color]);

  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);

  return (
    <sprite scale={[1.5, 1.5, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

export default function PlanetScene() {
  return (
    <div className='container'>
      <div className='ring'>
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }} gl={{ alpha: true, preserveDrawingBuffer: true }}
          style={{ background: 'transparent' }}>
          <ambientLight intensity={1} />
          <Planet />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
}
