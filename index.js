const languageSelect = document.getElementById('language');
const methodSelect = document.getElementById('method');
const urlInput = document.getElementById('url');
const authenticationSelect = document.getElementById('authentication');
const sendButton = document.getElementById('send');
const codeSnippet = document.getElementById('codeSnippet');
const requestBody = document.getElementById('postBody');

const apiTokenInput = document.getElementById('apiToken');

methodSelect.addEventListener('change', () => {
  requestBody.style.display = methodSelect.value === 'post' ? '' : 'none';
});

authenticationSelect.addEventListener('change', () => {
  apiTokenInput.style.display = authenticationSelect.value === 'bearer' ? '' : 'none';
});

sendButton.addEventListener('click', () => {
  if (isEmpty(urlInput.value)) {
    alert('Please enter a URL');
    return;
  }

  const language = languageSelect.value;
  const method = methodSelect.value;
  const authentication = authenticationSelect.value;
  const url = urlInput.value;
  const apiToken = apiTokenInput.value;
  const bodyContent = requestBody.value;

  let code = '';

  switch (language) {
    case 'javascript':
      code = generateJavaScriptSnippet(method, authentication, url, apiToken, bodyContent);
      break;
    case 'python':
      code = generatePythonSnippet(method, authentication, url, apiToken, bodyContent);
      break;
    default:
      code = 'Unsupported language';
  }

  codeSnippet.style.backgroundColor = '#393333';
  codeSnippet.textContent = code;
});

function generateJavaScriptSnippet(method, authentication, url, apiToken, bodyContent) {
  let code = '';

  switch (method) {
    case 'get':
      code = `try {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const response = await fetch("${url}", requestOptions);
  const result = await response.text();
  console.log(result);
} catch (error) {
  console.log('error', error);
}`;
      break;
    case 'post':
      code = `try {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ${authentication === 'bearer' ? `'Authorization': '${apiToken}',` : ''}
    },
    body: JSON.stringify(${bodyContent}),
    redirect: 'follow'
  };

  const response = await fetch("${url}", requestOptions);
  const result = await response.text();
  console.log(result);
} catch (error) {
  console.log('error', error);
}`;
      break;
    default:
      code = 'Unsupported method';
  }

  return code;
}

function generatePythonSnippet(method, authentication, url, apiToken, bodyContent) {
  let code = '';

  switch (method) {
    case 'get':
      code = `import requests

url = "${url}"
headers = ${authentication === 'bearer' ? `{'Authorization': '${apiToken}'}` : '{}'}

try:
  response = requests.get(url, headers=headers)
  print(response.text)
except Exception as error:
  print('error', error)`;
      break;
    case 'post':
      code = `import requests
import json

url = "${url}"
headers = {
  'Content-Type': 'application/json',
  ${authentication === 'bearer' ? `'Authorization': '${apiToken}',` : ''}
}
payload = json.dumps(${bodyContent})

try:
  response = requests.post(url, headers=headers, data=payload)
  print(response.text)
except Exception as error:
  print('error', error)`;
      break;
    default:
      code = 'Unsupported method';
  }

  return code;
}

function isEmpty(value) {
  return value.trim() === '';
}
