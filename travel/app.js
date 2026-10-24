const regionNames = { asia: '亚洲', africa: '非洲', europe: '欧洲', oceania: '大洋洲', america: '美洲' };
// Destination names are provided by the author. Stories and factual trip details remain empty until supplied.
const groups = {
  asia: ['中国', '香港', '澳门', '台湾', '日本', '韩国', '蒙古', '老挝', '缅甸', '越南', '柬埔寨', '泰国', '马来西亚', '印度尼西亚', '文莱', '菲律宾', '东帝汶', '新加坡', '孟加拉国', '尼泊尔', '斯里兰卡', '巴基斯坦', '马尔代夫', '阿联酋', '乌兹别克斯坦', '土耳其', '阿塞拜疆', '亚美尼亚', '格鲁吉亚'],
  africa: ['埃及'], europe: ['波黑', '塞尔维亚', '俄罗斯', '英国', '爱尔兰'], oceania: ['澳大利亚'], america: ['美国', '加拿大', '墨西哥', '哥斯达黎加']
};
const themes = [
  { sky: '#e8dfc2', sun: '#d8a268', back: '#b2ba9b', mid: '#7c9983', front: '#3e6e5e', water: '#b0c9bd' },
  { sky: '#dbe5e3', sun: '#efd9ab', back: '#b4c8c5', mid: '#8aa8a6', front: '#486f71', water: '#9bbfc0' },
  { sky: '#e8d8c4', sun: '#dbac7e', back: '#c7ad8a', mid: '#a18c70', front: '#64735e', water: '#c4c6af' },
  { sky: '#e1e5d8', sun: '#e7c995', back: '#b9c0a0', mid: '#96a77d', front: '#55714e', water: '#c2d2bd' }
];
function landscape(index, hero = false) {
  const c = themes[index % themes.length];
  return `<svg viewBox="0 0 700 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="700" height="500" fill="${c.sky}"/><circle cx="${hero ? 500 : 490 - index % 4 * 65}" cy="115" r="45" fill="${c.sun}"/><path d="M0 270 95 150 155 225 285 55 420 235 530 125 700 240V500H0Z" fill="${c.back}"/><path d="m230 125 55-70 80 108-75-38-25 12Z" fill="#f4f1df" opacity=".8"/><path d="M0 310 125 248 205 280 380 180 480 270 605 208 700 265V500H0Z" fill="${c.mid}"/><path d="M0 340Q180 270 350 327T700 312V500H0Z" fill="${c.water}"/><path d="M0 325Q110 285 238 355L490 500H0Z" fill="${c.front}"/><path d="M700 305Q590 300 510 370T355 500H700Z" fill="${c.front}"/><path d="M125 500Q200 450 170 405T125 360" fill="none" stroke="#e2d5b4" stroke-width="17"/><path d="m69 343 18-55 18 55Zm25 18 20-65 20 65Zm465-3 18-60 18 60Zm38-17 15-46 15 46Z" fill="${c.front}"/><path d="m390 370 45 0m-70 19h95m-53 18h54" stroke="#edf1df" stroke-width="2" opacity=".6"/><path d="m360 102 8-5 8 5m18 9 6-4 6 4" fill="none" stroke="${c.front}" stroke-width="2" opacity=".55"/></svg>`;
}
document.getElementById('hero-landscape').innerHTML = landscape(0, true);
document.getElementById('year').textContent = new Date().getFullYear();
const destinations = Object.entries(groups).flatMap(([region, names]) => names.map(name => ({ name, region })));
const featured = ['中国', '日本', '埃及', '英国', '澳大利亚', '墨西哥'];
destinations.sort((a, b) => (featured.includes(a.name) ? featured.indexOf(a.name) : 100) - (featured.includes(b.name) ? featured.indexOf(b.name) : 100));
destinations.forEach((item, index) => { item.id = `destination-${index}`; item.art = index; });
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem('jalen-travel-saved') || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter(name => destinations.some(d => d.name === name)));
} catch { /* The site remains usable when browser storage is unavailable. */ }
let region = 'all';
let limit = 6;
const search = document.getElementById('search');
const grid = document.getElementById('story-grid');
const more = document.getElementById('show-more');
function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const matches = destinations.filter(d => (region === 'all' || (region === 'saved' ? saved.has(d.name) : d.region === region)) && `${d.name} ${regionNames[d.region]} 旅行 游记 攻略`.toLocaleLowerCase().includes(query));
  grid.innerHTML = matches.slice(0, limit).map(d => `<article class="card"><div class="card-image"><button class="card-open" data-open="${d.id}" aria-label="查看${d.name}旅行手记">${landscape(d.art)}</button><span class="image-label">${regionNames[d.region]} / 风景插画</span><button class="save" data-save="${d.id}" aria-pressed="${saved.has(d.name)}" aria-label="${saved.has(d.name) ? '取消收藏' : '收藏'}${d.name}">${saved.has(d.name) ? '♥' : '♡'}</button></div><div class="card-meta">${regionNames[d.region]}<i></i>目的地手记</div><button class="card-open" data-open="${d.id}"><h3>${d.name} · 旅途里的风景与日常</h3></button><p>为${d.name}留一个位置，记录旅途中的遇见，整理路线、花费和实用经验。</p><div class="card-bottom"><span>游记与攻略待补充</span><a href="#${d.id}" data-open="${d.id}" aria-label="查看${d.name}目的地详情"><b>打开手记 ↗</b></a></div></article>`).join('');
  document.getElementById('results-count').textContent = `共 ${matches.length} 个目的地 · 当前展示 ${Math.min(limit, matches.length)} 个`;
  document.getElementById('empty').hidden = matches.length !== 0;
  more.hidden = matches.length <= limit;
  document.getElementById('saved-count').textContent = saved.size;
  document.querySelectorAll('.filter').forEach(button => {
    button.classList.toggle('active', button.dataset.region === region);
    button.setAttribute('aria-pressed', String(button.dataset.region === region));
  });
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { region = button.dataset.region; limit = 6; render(); }));
search.addEventListener('input', () => { limit = 6; render(); });
more.addEventListener('click', () => { limit += 12; render(); });
document.getElementById('reset').addEventListener('click', () => { region = 'all'; search.value = ''; limit = 6; render(); search.focus(); });
const dialog = document.getElementById('article-dialog');
function showArticle(content) { document.getElementById('article-content').innerHTML = content; dialog.showModal(); dialog.scrollTop = 0; }
grid.addEventListener('click', event => {
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) {
    const item = destinations.find(d => d.id === saveButton.dataset.save);
    saved.has(item.name) ? saved.delete(item.name) : saved.add(item.name);
    try { localStorage.setItem('jalen-travel-saved', JSON.stringify([...saved])); } catch {}
    render();
    grid.querySelector(`[data-save="${item.id}"]`)?.focus();
    return;
  }
  const button = event.target.closest('[data-open]');
  if (!button) return;
  event.preventDefault();
  const item = destinations.find(d => d.id === button.dataset.open);
  showArticle(`<span class="article-tag">${regionNames[item.region]} / DESTINATION JOURNAL</span><h2 id="article-title">${item.name}旅行手记</h2><p class="article-note">目的地已加入目录。以下为内容框架，真实旅行日期、照片、行程与费用尚待作者补充。</p><h3>01 / 旅途中的故事</h3><p>这里将记录在${item.name}的旅行经历：为什么出发、难忘的片刻、沿途遇到的人，以及想再去一次的地方。</p><h3>02 / 路线与每日行程</h3><p>待补充到达与离开方式、途经城市、每天的路线、交通耗时及住宿区域。</p><h3>03 / 花费与实用攻略</h3><p>待补充旅行日期与人数、使用币种，以及交通、住宿、餐饮、门票的实际花费。</p><h3>04 / 照片与旅行备忘</h3><p>待补充本人拍摄的照片、地点与说明，以及值得推荐的经验和下次想调整的安排。</p><a class="button" href="mailto:jalenchu49@gmail.com">聊聊这个目的地 ↗</a>`);
});
const guides = {
  planning: `<span class="article-tag">01 / PLAN · 通用规划建议</span><h2 id="article-title">把行程安排得刚刚好</h2><p>让路线服务于自己的兴趣，也给偶然的发现留一点时间。</p><ol><li><strong>先定边界。</strong>写下出行日期、出发地、同行人数和最想体验的三件事。</li><li><strong>在地图上分组。</strong>把相邻景点放在同一天，记录实际交通耗时，减少来回折返。</li><li><strong>每天留一段空白。</strong>抵达日安排轻一点，把热门项目和需要预约的活动优先确认。</li><li><strong>核实开放与预约。</strong>在景点、运输公司等官方渠道确认营业时间、班次与取消规则。</li><li><strong>准备替代方案。</strong>为天气变化和交通调整准备一项室内活动或可替换路线。</li></ol><p class="article-note">这是通用规划清单。各目的地的实际路线将在对应游记中补充。</p>`,
  budget: `<span class="article-tag">02 / BUDGET · 通用预算建议</span><h2 id="article-title">让预算花在喜欢的地方</h2><p>先统一币种和人数，再把一次性支出与每天的支出分开。</p><ul><li><strong>跨城交通：</strong>往返机票、火车、长途巴士，以及行李和接驳费用。</li><li><strong>当地交通：</strong>公共交通、打车、租车、燃油及停车费。</li><li><strong>住宿：</strong>每晚含税价格 × 晚数，留意押金和清洁费。</li><li><strong>餐饮与活动：</strong>每日餐饮预算 × 天数，再加门票和体验项目。</li><li><strong>其他支出：</strong>签证或入境手续、保险、通信、汇兑和个人购物。</li><li><strong>机动预算：</strong>根据行程弹性另留一笔备用金，不把所有预算提前用完。</li></ul><p class="article-note">目的地实际价格、币种、汇率日期和人均费用待作者补充；这里未提供未经核实的报价。</p>`,
  packing: `<span class="article-tag">03 / PACK · 可勾选行前清单</span><h2 id="article-title">轻装出发，也准备周全</h2><p>按你的旅行方式调整这份清单。勾选状态会保存在当前浏览器中。</p><div id="packing-list">${['有效旅行证件与所需入境材料', '机票、车票与住宿确认', '支付方式与适量现金', '手机、充电器与适用转换插头', '适合天气和活动的衣物与鞋子', '个人常用药品与必需用品', '所需旅行保险与紧急联系方式', '离线地图与重要材料备份', '通信或网络方案', '检查行李额度与携带规定'].map((text, index) => `<label class="packing-item"><input type="checkbox" data-pack="${index}"><span>${text}</span></label>`).join('')}</div>`
};
document.querySelectorAll('[data-guide]').forEach(button => button.addEventListener('click', () => {
  showArticle(guides[button.dataset.guide]);
  dialog.querySelectorAll('[data-pack]').forEach(input => {
    try { input.checked = localStorage.getItem(`jalen-travel-pack-${input.dataset.pack}`) === 'true'; } catch {}
    input.addEventListener('change', () => { try { localStorage.setItem(`jalen-travel-pack-${input.dataset.pack}`, String(input.checked)); } catch {} });
  });
}));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
render();
