const SIZES = {
  'Instagram 1080 × 1080': [1080, 1080],
  'Instagram 1080 × 1350': [1080, 1350],
  'Story 1080 × 1920': [1080, 1920],
  'A4 794 × 1123': [794, 1123]
};

const WORKSPACE_KEY = 'template-studio-workspace';
const INITIAL_SIZE = 'Instagram 1080 × 1080';
let canvas;
let sizeName = INITIAL_SIZE;
let zoom = 0.65;
let selected = null;
let font = 'Montserrat';
let fontSize = 52;
let textColor = '#111111';
let objectBackgroundColor = '#111111';
let restoring = false;
let history = [];
let historyIndex = -1;

const $ = id => document.getElementById(id);

const fundoTelaBtn = document.getElementById('fundotela-btn');
const canvasBackgroundColor = document.getElementById('canvas-background-color');

fundoTelaBtn.addEventListener('click', () => {
    canvasBackgroundColor.click();
});

canvasBackgroundColor.addEventListener('input', (event) => {
    const color = event.target.value;
    canvas.backgroundColor = color;
    canvas.requestRenderAll();
    saveHistory();
});

function setStatus(message) { $('status').textContent = message; }

function serializeCanvas() {
  return JSON.stringify(canvas.toJSON(['id']));
}

function saveWorkspace(state) {
  try {
    localStorage.setItem(WORKSPACE_KEY, state);
    console.log('💾 WORKSPACE SALVO:', state);
  } catch (error) {
    console.error('Erro ao salvar workspace:', error);
    setStatus('Não foi possível salvar localmente');
  }
}

async function loadWorkspace() {
  const saved = localStorage.getItem(WORKSPACE_KEY);
  if (!saved) {
    const initial = serializeCanvas();
    history = [initial];
    historyIndex = 0;
    return;
  }

  try {
    restoring = true;
    await canvas.loadFromJSON(JSON.parse(saved));
    canvas.requestRenderAll();
    history = [saved];
    historyIndex = 0;
    setStatus('Workspace carregado');
  } catch (error) {
    console.error('Erro ao carregar workspace:', error);
    setStatus('Não foi possível carregar o workspace');
  } finally {
    restoring = false;
  }
}

function saveHistory() {
  if (!canvas || restoring) return;
  const state = serializeCanvas();
  const arr = history.slice(0, historyIndex + 1);
  if (arr[arr.length - 1] === state) return;
  saveWorkspace(state);
  arr.push(state);
  if (arr.length > 40) arr.shift();
  history = arr;
  historyIndex = arr.length - 1;
}

function updateSelection() {
  selected = canvas.getActiveObject() || null;
  const hasSelection = !!selected;
  $('empty-properties').hidden = hasSelection;
  $('selected-properties').hidden = !hasSelection;
  $('text-properties').hidden = !selected || selected.type !== 'i-text';
  $('object-properties').hidden = !selected || (selected.type !== 'rect' && selected.type !== 'circle');


  if (selected && selected.type === 'i-text') {
    font = String(selected.fontFamily || 'Montserrat');
    fontSize = Number(selected.fontSize || 52);
    textColor = String(selected.fill || '#111111');
    $('font-select').value = font;
    $('font-size').value = fontSize;
    $('text-color').value = normalizeColor(textColor);
    $('text-color-value').textContent = textColor;
  }

    if (selected && (selected.type === 'rect' || selected.type === 'circle')) {
        objectBackgroundColor = String(selected.fill || '#111111');
        $('background-color').value = normalizeColor(objectBackgroundColor);
        $('background-color-value').textContent = objectBackgroundColor;
    }
}

function normalizeColor(value) {
  if (typeof value !== 'string') return '#111111';
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#111111';
}

function changeSize(name) {
  sizeName = name;
  const [w, h] = SIZES[name];
  canvas.setDimensions({ width: w, height: h });
  $('project-size').textContent = name;
  canvas.requestRenderAll();
  saveHistory();
}

function addText() {
  const text = new fabric.IText('Seu texto aqui', {
    left: 180, top: 180, fontFamily: font, fontSize, fill: textColor,
    fontWeight: '700', id: `text-${Date.now()}`
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  text.enterEditing();
  text.selectAll();
  canvas.requestRenderAll();
  setStatus('Texto adicionado');
  saveHistory();
}

function addRect() {
  const rect = new fabric.Rect({
    left: 180, top: 300, width: 360, height: 180,
    fill: '#111111', rx: 0, ry: 0, id: `rect-${Date.now()}`
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
  saveHistory();
}

function addCircle() {
  const circle = new fabric.Circle({
    left: 250, top: 300, radius: 100,
    fill: '#e85d04', id: `circle-${Date.now()}`
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
  saveHistory();
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file) {
  if (!canvas) return;
  try {
    // Data URL, em vez de blob:, permite restaurar a imagem depois de um F5.
    const dataUrl = await fileToDataURL(file);
    const img = await fabric.FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });
    const max = Math.min(520, canvas.getWidth() * 0.72);
    const scale = Math.min(max / (img.width || max), max / (img.height || max));
    img.set({ left: 80, top: 80, scaleX: scale, scaleY: scale, id: `image-${Date.now()}` });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
    setStatus('Imagem adicionada e salva localmente');
    saveHistory();
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
    setStatus('Erro ao carregar imagem');
  }
}

function updateText(key, value) {
  const obj = canvas.getActiveObject();
  if (!obj || obj.type !== 'i-text') return;
  obj.set(key, value);
  canvas.requestRenderAll();
  saveHistory();
}

function updateObject(key, value) {
  const obj = canvas.getActiveObject();
  if (!obj || (obj.type !== 'rect' && obj.type !== 'circle')) return;
  obj.set(key, value);
  canvas.requestRenderAll();
  saveHistory();
}

function remove() {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  canvas.remove(obj);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  saveHistory();
  updateSelection();
  setStatus('Elemento excluído');
}

function front() {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  canvas.bringObjectForward(obj);
  canvas.requestRenderAll();
  saveHistory();
}

function back() {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  canvas.sendObjectBackwards(obj);
  canvas.requestRenderAll();
  saveHistory();
}

async function restore(state) {
  restoring = true;
  try {
    await canvas.loadFromJSON(JSON.parse(state));
    canvas.requestRenderAll();
    updateSelection();
  } finally {
    restoring = false;
  }
}

async function undo() {
  if (historyIndex <= 0) return;
  historyIndex--;
  await restore(history[historyIndex]);
  saveWorkspace(history[historyIndex]);
  setStatus('Desfeito');
}

async function redo() {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  await restore(history[historyIndex]);
  saveWorkspace(history[historyIndex]);
  setStatus('Refeito');
}

function exportPNG() {
  const data = canvas.toDataURL({ format: 'png', multiplier: 1 });
  const a = document.createElement('a');
  a.href = data;
  a.download = 'meu-template.png';
  a.click();
  setStatus('PNG exportado');
}

function duplicateSelected() {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  obj.clone().then(clone => {
    clone.set({ left: (obj.left || 0) + 20, top: (obj.top || 0) + 20, id: `clone-${Date.now()}` });
    canvas.add(clone);
    canvas.setActiveObject(clone);
    canvas.requestRenderAll();
    saveHistory();
  });
}

function setZoom(value) {
  zoom = Math.max(0.25, Math.min(1.5, value));
  canvas.setZoom(zoom);
  canvas.requestRenderAll();
  $('zoom-label').textContent = `${Math.round(zoom * 100)}%`;
}

function initialize() {
  const select = $('size-select');
  Object.keys(SIZES).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
  select.value = INITIAL_SIZE;

  canvas = new fabric.Canvas('editor-canvas', {
    width: 1080,
    height: 1080,
    backgroundColor: '#ffffff',
    preserveObjectStacking: true,
    selection: true
  });
  canvas.setZoom(zoom);

  canvas.on('selection:created', updateSelection);
  canvas.on('selection:updated', updateSelection);
  canvas.on('selection:cleared', updateSelection);
  canvas.on('object:modified', saveHistory);
  canvas.on('text:changed', saveHistory);

  $('image-btn').addEventListener('click', () => $('file-input').click());
  $('file-input').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (file) uploadImage(file);
    e.target.value = '';
  });
  $('text-btn').addEventListener('click', addText);
  $('rect-btn').addEventListener('click', addRect);
  $('circle-btn').addEventListener('click', addCircle);
  $('undo-btn').addEventListener('click', undo);
  $('redo-btn').addEventListener('click', redo);
  $('export-btn').addEventListener('click', exportPNG);
  $('zoom-out').addEventListener('click', () => setZoom(zoom - 0.1));
  $('zoom-in').addEventListener('click', () => setZoom(zoom + 0.1));
  $('size-select').addEventListener('change', e => changeSize(e.target.value));
  $('delete-btn').addEventListener('click', remove);
  $('front-btn').addEventListener('click', front);
  $('back-btn').addEventListener('click', back);
  $('font-select').addEventListener('change', e => {
    font = e.target.value;
    updateText('fontFamily', font);
  });
  $('font-size').addEventListener('input', e => {
    fontSize = Number(e.target.value);
    updateText('fontSize', fontSize);
  });
  $('text-color').addEventListener('input', e => {
    textColor = e.target.value;
    $('text-color-value').textContent = textColor;
    updateText('fill', textColor);
  });

  $('background-color').addEventListener('input', (event) => {
    const selected = canvas.getActiveObject();
    if (!selected) return;
    if (selected.type !== 'rect' && selected.type !== 'circle') {
        return;
    }
    const color = event.target.value;
    selected.set('fill', color);
    canvas.requestRenderAll();
    $('background-color-value').textContent = color;
    saveHistory();
  });

  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      e.shiftKey ? redo() : undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      duplicateSelected();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const tag = e.target && e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') remove();
    }
  });

  loadWorkspace();
}



window.addEventListener('DOMContentLoaded', initialize);
