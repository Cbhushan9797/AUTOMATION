const generateBtn = document.getElementById('generateBtn');
const runBtn = document.getElementById('runBtn');
const editBtn = document.getElementById('editBtn');
const userInput = document.getElementById('userInput');
const scriptOutput = document.getElementById('scriptOutput');
const result = document.getElementById('result');
const knowledgeFile = document.getElementById('knowledgeFile');
const contextFile = document.getElementById('contextFile');
const contextText = document.getElementById('contextText');

let uploadedFiles = {
  knowledge: [],
  context: []
};

let editMode = false;

// File uploads
knowledgeFile.addEventListener('change', (e) => handleFileUpload(e, 'knowledge'));
contextFile.addEventListener('change', (e) => handleFileUpload(e, 'context'));

generateBtn.addEventListener('click', generateScript);
runBtn.addEventListener('click', runScript);
editBtn.addEventListener('click', toggleEditMode);

function handleFileUpload(e, type) {
  const files = Array.from(e.target.files);
  uploadedFiles[type] = files;
  displayFileList(type);
}

function displayFileList(type) {
  const container = type === 'knowledge' ? 
    document.getElementById('knowledgeList') : 
    document.getElementById('contextList');
  
  container.innerHTML = '';
  
  if (uploadedFiles[type].length === 0) return;
  
  const list = document.createElement('div');
  list.className = 'file-list';
  
  uploadedFiles[type].forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <span>📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
      <button onclick="removeFile('${type}', ${index})">Remove</button>
    `;
    list.appendChild(item);
  });
  
  container.appendChild(list);
}

function removeFile(type, index) {
  uploadedFiles[type].splice(index, 1);
  displayFileList(type);
}

async function generateScript() {
  const userRequest = userInput.value.trim();
  
  if (!userRequest) {
    alert('Please describe what you want to automate');
    return;
  }

  result.innerHTML = '<p class="loading">⏳ Processing files and generating script...</p>';
  generateBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('userRequest', userRequest);
    formData.append('contextText', contextText.value);
    
    // Add knowledge base files
    uploadedFiles.knowledge.forEach(file => {
      formData.append('knowledgeFiles', file);
    });
    
    // Add context files
    uploadedFiles.context.forEach(file => {
      formData.append('contextFiles', file);
    });

    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (data.success) {
      scriptOutput.value = data.script;
      runBtn.disabled = false;
      editBtn.disabled = false;
      result.innerHTML = '<p class="success">✅ Script generated successfully!</p>';
    } else {
      result.innerHTML = `<p class="error">❌ Error: ${data.error}</p>`;
    }
  } catch (error) {
    result.innerHTML = `<p class="error">❌ Error: ${error.message}</p>`;
  } finally {
    generateBtn.disabled = false;
  }
}

function toggleEditMode() {
  editMode = !editMode;
  scriptOutput.readOnly = !editMode;
  editBtn.textContent = editMode ? '✅ Done Editing' : '✏️ Edit Script';
  scriptOutput.style.background = editMode ? 'white' : '#1e1e1e';
  scriptOutput.style.color = editMode ? 'black' : '#d4d4d4';
}

async function runScript() {
  const script = scriptOutput.value.trim();
  
  if (!script) {
    alert('No script to run');
    return;
  }

  result.innerHTML = '<p class="loading">⏳ Running automation...</p>';
  runBtn.disabled = true;

  try {
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script })
    });

    const data = await response.json();
    
    if (data.success) {
      result.innerHTML = `<p class="success">✅ ${data.message}\n\n${data.output || ''}</p>`;
    } else {
      result.innerHTML = `<p class="error">❌ Error: ${data.error}</p>`;
    }
  } catch (error) {
    result.innerHTML = `<p class="error">❌ Error: ${error.message}</p>`;
  } finally {
    runBtn.disabled = false;
  }
}