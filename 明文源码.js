import { connect } from 'cloudflare:sockets';

//  配置区块
let SUB_PATH = 'sub'; //实际上这是你的订阅路径，支持任意大小写字母和数字，[域名/ID]进入订阅页面
let SUB_UUID = 'aa23a45c-cbbc-4dd6-ba51-5be0cc0a62a8'; //这是真实的UUID，通用订阅会进行验证，建议修改为自己的规范化UUID

let 私钥开关 = false //是否启用私钥功能，true启用，false不启用，因为私钥功能只支持clash，如果打算使用通用订阅则需关闭私钥功能
let 咦这是我的私钥哎 = '' //这是你的私钥，提高隐秘性安全性，就算别人扫到你的域名也无法链接，再也不怕别人薅请求数了^_^

let 隐藏订阅 = false //选择是否隐藏订阅页面，false不隐藏，true隐藏，当然隐藏后自己也无法订阅，因为配置固定，适合自己订阅后就隐藏，防止被爬订阅，并且可以到下方添加嘲讽语^_^
let 嘲讽语 = "哎呀你找到了我，但是我就是不给你看，气不气，嘿嘿嘿" //隐藏订阅后，真实的订阅页面就会显示这段话，想写啥写啥

let 我的优选 = [
  //'www.visa.com',
] //格式127.0.0.1:443#US@notls或[2606:4700:3030:0:4563:5696:a36f:cdc5]:2096#US，如果#US不填则使用统一名称，如果@notls不填则默认使用TLS，每行一个，如果不填任何节点会生成一个默认自身域名的小黄云节点
let TXT_URL ='' //优选TXT路径[https://ip.txt]，表达格式与上述相同，使用TXT时脚本内部填写的节点无效，二选一

let 启用反代功能 = true //选择是否启用反代功能【总开关】，false，true，现在你可以自由的选择是否启用反代功能了
let 反代IP = 'ts.hpc.tw:443' //反代IP或域名，反代IP端口一般情况下不用填写，如果你非要用非标反代的话，可以填'ts.hpc.tw:443'这样

let 启用SOCKS5反代 = false //如果启用此功能，原始反代将失效
let 启用SOCKS5全局反代 = false //选择是否启用SOCKS5全局反代，启用后所有访问都是S5的落地【无论你客户端选什么节点】，访问路径是客户端--CF--SOCKS5，当然启用此功能后延迟=CF+SOCKS5，带宽取决于SOCKS5的带宽，不再享受CF高速和随时满带宽的待遇
let 我的SOCKS5账号 = '' //格式'账号:密码@地址:端口'

let SUB_NAME = '节点' //自己的节点名字【统一名称】

let 伪装网页 = 'www.baidu.com' //填入伪装网页，格式'www.youku.com'，建议用小站伪装，比较靠谱
//////////////////////////////////////////////////////////////////////////网页入口////////////////////////////////////////////////////////////////////////
export default {
  async fetch(访问请求, env) {
    const 读取我的请求标头 = 访问请求.headers.get('Upgrade');
    const url = new URL(访问请求.url);
    if (!读取我的请求标头 || 读取我的请求标头 !== 'websocket') {
      if (TXT_URL) {
        const 读取优选文本 = await fetch(TXT_URL);
        const 转换优选文本 = await 读取优选文本.text();
        const 优选节点 = 转换优选文本.split('\n').map(line => line.trim()).filter(line => line);
        我的优选 = 优选节点 || 我的优选
      }
      switch (url.pathname) {
        case `/${SUB_PATH}`: {
          const 订阅页面 = 给我订阅页面(SUB_PATH, 访问请求.headers.get('Host'));
          return new Response(`${订阅页面}`, {
            status: 200,
            headers: { "Content-Type": "text/plain;charset=utf-8" }
          });
        }
        case `/${SUB_PATH}/v2ray`: {
          if (隐藏订阅) {
            return new Response (`${嘲讽语}`, {
              status: 200,
              headers: { "Content-Type": "text/plain;charset=utf-8" }
            });
          } else {
            const 通用配置文件 = 给我通用配置文件(访问请求.headers.get('Host'));
            return new Response(`${通用配置文件}`, {
              status: 200,
              headers: { "Content-Type": "text/plain;charset=utf-8" }
            });
          }
        }
        case `/${SUB_PATH}/clash`: {
          if (隐藏订阅) {
            return new Response (`${嘲讽语}`, {
              status: 200,
              headers: { "Content-Type": "text/plain;charset=utf-8" }
            });
          } else {
            const 小猫咪配置文件 = 给我小猫咪配置文件(访问请求.headers.get('Host'));
            return new Response(`${小猫咪配置文件}`, {
              status: 200,
              headers: { "Content-Type": "text/plain;charset=utf-8" }
            });
          }
        }
        default:
          url.hostname = 伪装网页;
          url.protocol = 'https:';
          访问请求 = new Request(url, 访问请求);
          return fetch(访问请求);
      }
    } else if (读取我的请求标头 === 'websocket'){
      反代IP = env.PROXYIP || 反代IP;
      我的SOCKS5账号 = env.SOCKS5 || 我的SOCKS5账号;
      启用SOCKS5反代 = (env.SOCKS5OPEN === 'true') ? true : (env.SOCKS5OPEN === 'false' ? false : 启用SOCKS5反代);
      启用SOCKS5全局反代 = (env.SOCKS5GLOBAL === 'true') ? true : (env.SOCKS5GLOBAL === 'false' ? false : 启用SOCKS5全局反代);
      if (私钥开关) {
        const 验证我的私钥 = 访问请求.headers.get('my-key')
        if (验证我的私钥 === 咦这是我的私钥哎) {
          return await 升级WS请求(访问请求);
        }
      } else {
        return await 升级WS请求(访问请求);
      }
    }
  }
};
////////////////////////////////////////////////////////////////////////脚本主要架构//////////////////////////////////////////////////////////////////////
//第一步，读取和构建基础访问结构
async function 升级WS请求(访问请求) {
  const 创建WS接口 = new WebSocketPair();
  const [客户端, WS接口] = Object.values(创建WS接口);
  WS接口.accept();
  const 读取我的加密访问内容数据头 = 访问请求.headers.get('sec-websocket-protocol');
  const 解密数据 = 使用64位加解密(读取我的加密访问内容数据头); //解密目标访问数据，传递给TCP握手进程
  const { TCP接口, 写入初始数据 } = await 解析VL标头(解密数据); //解析VL数据并进行TCP握手
  建立传输管道(WS接口, TCP接口, 写入初始数据);
  return new Response(null, { status: 101, webSocket: 客户端 });
}
function 使用64位加解密(还原混淆字符) {
  还原混淆字符 = 还原混淆字符.replace(/-/g, '+').replace(/_/g, '/');
  const 解密数据 = atob(还原混淆字符);
  const 解密_你_个_丁咚_咙_咚呛 = Uint8Array.from(解密数据, (c) => c.charCodeAt(0));
  return 解密_你_个_丁咚_咙_咚呛.buffer;
}
//第二步，解读VL协议数据，创建TCP握手
async function 解析VL标头(VL数据, TCP接口) {
  if (!私钥开关 && 验证VL的密钥(new Uint8Array(VL数据.slice(1, 17))) !== SUB_UUID) {
    return null;
  }
  const 获取数据定位 = new Uint8Array(VL数据)[17];
  const 提取端口索引 = 18 + 获取数据定位 + 1;
  const 建立端口缓存 = VL数据.slice(提取端口索引, 提取端口索引 + 2);
  const 访问端口 = new DataView(建立端口缓存).getUint16(0);
  const 提取地址索引 = 提取端口索引 + 2;
  const 建立地址缓存 = new Uint8Array(VL数据.slice(提取地址索引, 提取地址索引 + 1));
  const 识别地址类型 = 建立地址缓存[0];
  let 地址长度 = 0;
  let 访问地址 = '';
  let 地址信息索引 = 提取地址索引 + 1;
  switch (识别地址类型) {
    case 1:
      地址长度 = 4;
      访问地址 = new Uint8Array( VL数据.slice(地址信息索引, 地址信息索引 + 地址长度) ).join('.');
      break;
    case 2:
      地址长度 = new Uint8Array( VL数据.slice(地址信息索引, 地址信息索引 + 1) )[0];
      地址信息索引 += 1;
      访问地址 = new TextDecoder().decode( VL数据.slice(地址信息索引, 地址信息索引 + 地址长度) );
      break;
    case 3:
      地址长度 = 16;
      const dataView = new DataView( VL数据.slice(地址信息索引, 地址信息索引 + 地址长度) );
      const ipv6 = [];
      for (let i = 0; i < 8; i++) { ipv6.push(dataView.getUint16(i * 2).toString(16)); }
      访问地址 = ipv6.join(':');
      break;
  }
  const 写入初始数据 = VL数据.slice(地址信息索引 + 地址长度);
  if (启用反代功能 && 启用SOCKS5反代 && 启用SOCKS5全局反代) {
    TCP接口 = await 创建SOCKS5接口(识别地址类型, 访问地址, 访问端口);
    return { TCP接口, 写入初始数据 };
  } else {
    try {
    TCP接口 = connect({ hostname: 访问地址, port: 访问端口 });
    await TCP接口.opened;
    } catch {
      if (启用反代功能) {
        if (启用SOCKS5反代) {
          TCP接口 = await 创建SOCKS5接口(识别地址类型, 访问地址, 访问端口);
        } else {
          let [反代IP地址, 反代IP端口] = 反代IP.split(':');
          TCP接口 = connect({ hostname: 反代IP地址, port: 反代IP端口 || 访问端口 });
        }
      }
    } finally {
      return { TCP接口, 写入初始数据 };
    }
  }
}
function 验证VL的密钥(arr, offset = 0) {
  const uuid = (转换密钥格式[arr[offset + 0]] + 转换密钥格式[arr[offset + 1]] + 转换密钥格式[arr[offset + 2]] + 转换密钥格式[arr[offset + 3]] + "-" + 转换密钥格式[arr[offset + 4]] + 转换密钥格式[arr[offset + 5]] + "-" + 转换密钥格式[arr[offset + 6]] + 转换密钥格式[arr[offset + 7]] + "-" + 转换密钥格式[arr[offset + 8]] + 转换密钥格式[arr[offset + 9]] + "-" + 转换密钥格式[arr[offset + 10]] + 转换密钥格式[arr[offset + 11]] + 转换密钥格式[arr[offset + 12]] + 转换密钥格式[arr[offset + 13]] + 转换密钥格式[arr[offset + 14]] + 转换密钥格式[arr[offset + 15]]).toLowerCase();
  return uuid;
}
const 转换密钥格式 = [];
for (let i = 0; i < 256; ++i) { 转换密钥格式.push((i + 256).toString(16).slice(1)); }
//第三步，创建客户端WS-CF-目标的传输通道并监听状态
async function 建立传输管道(WS接口, TCP接口, 写入初始数据, TCP缓存 = [], WS缓存 = []) {
  const 传输数据 = TCP接口.writable.getWriter();
  await WS接口.send(new Uint8Array([0, 0]).buffer); //向客户端发送WS握手认证信息
  TCP接口.readable.pipeTo(new WritableStream({ //将TCP接口返回的数据通过WS接口发送回客户端【优先建立客户端与CF的WS回传通道，防止初始包返回数据时通道任未建立导致丢失数据】
    async write(VL数据) {
      WS缓存.push(VL数据);
      const WS数据块 = WS缓存.shift();
      WS接口.send(WS数据块)
    }
  }));
  const 数据流 = new ReadableStream({ //监听WS接口数据并发送给数据流
    async start(控制器) {
      if (写入初始数据) { 控制器.enqueue(写入初始数据); 写入初始数据 = null };
      WS接口.addEventListener('message', (event) => { 控制器.enqueue(event.data) }); //监听客户端WS接口消息，推送给数据流
      WS接口.addEventListener('close', () => { 控制器.close() }); //监听客户端WS接口关闭信息，结束流传输
      WS接口.addEventListener('error', () => { 控制器.close() }); //监听客户端WS接口异常信息，结束流传输
    }
  });
  数据流.pipeTo(new WritableStream({ //将客户端接收到的WS数据发往TCP接口
    async write(VL数据) {
      TCP缓存.push(VL数据);
      const TCP数据块 = TCP缓存.shift();
      传输数据.write(TCP数据块);
    },
  }));
}
//////////////////////////////////////////////////////////////////////////SOCKS5部分//////////////////////////////////////////////////////////////////////
async function 创建SOCKS5接口(识别地址类型, 访问地址, 访问端口) {
  const { username, password, hostname, port } = await 获取SOCKS5账号(我的SOCKS5账号);
  const SOCKS5接口 = connect({ hostname, port });
  try {
    await SOCKS5接口.opened;
  } catch {
    return new Response('SOCKS5未连通', { status: 400 });
  }
  const writer = SOCKS5接口.writable.getWriter();
  const reader = SOCKS5接口.readable.getReader();
  const encoder = new TextEncoder();
  const socksGreeting = new Uint8Array([5, 2, 0, 2]); //构建认证信息,支持无认证和用户名/密码认证
  await writer.write(socksGreeting);
  let res = (await reader.read()).value;
  if (res[1] === 0x02) { //检查是否需要用户名/密码认证
    if (!username || !password) {
      return 关闭接口并退出();
    }
    const authRequest = new Uint8Array([ 1, username.length, ...encoder.encode(username), password.length, ...encoder.encode(password) ]); // 发送用户名/密码认证请求
    await writer.write(authRequest);
    res = (await reader.read()).value;
    if (res[0] !== 0x01 || res[1] !== 0x00) {
      return 关闭接口并退出(); // 认证失败
    }
  }
  let 转换访问地址;
  switch (识别地址类型) {
    case 1: // IPv4
      转换访问地址 = new Uint8Array( [1, ...访问地址.split('.').map(Number)] );
      break;
    case 2: // 域名
      转换访问地址 = new Uint8Array( [3, 访问地址.length, ...encoder.encode(访问地址)] );
      break;
    case 3: // IPv6
      转换访问地址 = new Uint8Array( [4, ...访问地址.split(':').flatMap(x => [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2), 16)])] );
      break;
    default:
      return 关闭接口并退出();
  }
  const socksRequest = new Uint8Array([ 5, 1, 0, ...转换访问地址, 访问端口 >> 8, 访问端口 & 0xff ]); //发送转换后的访问地址/端口
  await writer.write(socksRequest);
  res = (await reader.read()).value;
  if (res[0] !== 0x05 || res[1] !== 0x00) {
    return 关闭接口并退出(); // 连接失败
  }
  writer.releaseLock();
  reader.releaseLock();
  return SOCKS5接口;
  function 关闭接口并退出() {
    writer.releaseLock();
    reader.releaseLock();
    SOCKS5接口.close();
    return new Response('SOCKS5握手失败', { status: 400 });
  }
}
async function 获取SOCKS5账号(SOCKS5) {
  const [latter, former] = SOCKS5.split("@").reverse();
  let username, password, hostname, port;
  if (former) {
    const formers = former.split(":");
    username = formers[0];
    password = formers[1];
  }
  const latters = latter.split(":");
  port = Number(latters.pop());
  hostname = latters.join(":");
  return { username, password, hostname, port };
}
//////////////////////////////////////////////////////////////////////////订阅页面////////////////////////////////////////////////////////////////////////
let 我的私钥;
if (私钥开关) {
  我的私钥 = `my-key: ${咦这是我的私钥哎}`
} else {
  我的私钥 = ""
}
function 给我订阅页面(SUB_PATH, hostName) {
return `
v2ray的：https://${hostName}/${SUB_PATH}/v2ray
clash的：https://${hostName}/${SUB_PATH}/clash
`;
}
function 给我通用配置文件(hostName) {
if (我的优选.length === 0){
  我的优选 = [`${hostName}:443`]
}
if (私钥开关) {
  return `请先关闭私钥功能`
}else {
  return 我的优选.map(获取优选 => {
    const [主内容,tls] = 获取优选.split("@");
    const [地址端口, 节点名字 = SUB_NAME] = 主内容.split("#");
    const 拆分地址端口 = 地址端口.split(":");
    const 端口 =拆分地址端口.length > 1 ? Number(拆分地址端口.pop()) : 443;
    const 地址 = 拆分地址端口.join(":");
    const TLS开关 = tls === 'notls' ? 'security=none' : 'security=tls';
    return `vless://${SUB_UUID}@${地址}:${端口}?encryption=none&${TLS开关}&sni=${hostName}&type=ws&host=${hostName}&path=%2F%3Fed%3D2560#${节点名字}`;
  }).join("\n");
}
}
function 给我小猫咪配置文件(hostName) {
if (我的优选.length === 0){
  我的优选 = [`${hostName}:443`]
}
const 生成节点 = (我的优选) => {
  return 我的优选.map(获取优选 => {
    const [主内容,tls] = 获取优选.split("@");
    const [地址端口, 节点名字 = SUB_NAME] = 主内容.split("#");
    const 拆分地址端口 = 地址端口.split(":");
    const 端口 =拆分地址端口.length > 1 ? Number(拆分地址端口.pop()) : 443;
    const 地址 = 拆分地址端口.join(":").replace(/^\[(.+)\]$/, '$1');
    const TLS开关 = tls === 'notls' ? 'false' : 'true';
  return {
    nodeConfig: `- name: ${节点名字}-${地址}-${端口}
  type: vless
  server: ${地址}
  port: ${端口}
  uuid: ${SUB_UUID}
  udp: false
  tls: ${TLS开关}
  sni: ${hostName}
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}`,
    proxyConfig: `    - ${节点名字}-${地址}-${端口}`
    };
  });
};
const 节点配置 = 生成节点(我的优选).map(node => node.nodeConfig).join("\n");
const 代理配置 = 生成节点(我的优选).map(node => node.proxyConfig).join("\n");
return `
proxies:
${节点配置}
proxy-groups:
- name: 🚀 节点选择
  type: select
  proxies:
    - ♻️ 自动选择
    - 🔯 故障转移
${代理配置}
- name: 🐟 漏网之鱼
  type: select
  proxies:
    - DIRECT
    - 🚀 节点选择
- name: 🎯 全球直连
  type: select
  proxies:
    - DIRECT
    - 🚀 节点选择
- name: ♻️ 自动选择
  type: url-test
  url: https://www.google.com/generate_204
  interval: 150
  tolerance: 50
  proxies:
${代理配置}
- name: 🔯 故障转移
  type: fallback
  health-check:
    enable: true
    interval: 300
    url: https://www.google.com/generate_204
  proxies:
${代理配置}
rules:
  - GEOIP,LAN,🎯 全球直连,no-resolve
  - GEOSITE,cn,🎯 全球直连
  - GEOIP,CN,🎯 全球直连,no-resolve
  - DOMAIN-SUFFIX,cn,🎯 全球直连
  - GEOSITE,gfw,🚀 节点选择
  - GEOSITE,google,🚀 节点选择
  - GEOIP,GOOGLE,🚀 节点选择,no-resolve
  - GEOSITE,netflix,🚀 节点选择
  - GEOIP,NETFLIX,🚀 节点选择,no-resolve
  - GEOSITE,telegram,🚀 节点选择
  - GEOIP,TELEGRAM,🚀 节点选择,no-resolve
  - GEOSITE,openai,🚀 节点选择
  - MATCH,🐟 漏网之鱼
`
}