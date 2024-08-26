import qr from 'qr-image';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method === 'POST') {
			return generateQRCode(request);
		}

		return new Response(landing, {
			headers: {
				'Content-Type': 'text/html',
			},
		});
	},
} satisfies ExportedHandler<Env>;

async function generateQRCode(request: Request) {
	const res: any = await request.json();
	const headers = { 'Content-Type': 'image/png' };
	const qr_png = qr.imageSync(res.text || 'https://workers.dev');

	return new Response(qr_png, { headers });
}

const landing: any = `
<style>
body {
	max-width: 700px;
	margin: 20px auto;
}
img{
max-width: 100%;
width:300px;
height:400px;
border:none;
aspect-ratio: 1/1;
object-fit:cover;
}
</style>
<h1>QR Code Generator</h1>
<p>Click the below button to generate a new QR code</p>
<label for="qr-code">Input</label>
<input type="text" name="qr-code" id="qr-code-text" placeholder="https://www.google.com"/>
<button onclick="generate()">Generate QR Code</button>
<p>Generated QR Code Image</p>
<img id="qr" src="" alt="QR_codeImage" />
<script>
	const imageElem = document.querySelector('#img');
	const ImageSrc = document.querySelector("#qr")
	ImageSrc.style.display = 'none';
	  function generate(){
	  	if(!document.getElementById('qr-code-text').value){
		return;
		}
		console.log(window.location.pathname);
		fetch(window.location.pathname,{
		method:"POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({text: document.getElementById('qr-code-text').value})
		}).then(res => res.blob()).then((result) => {
			console.log(result)
			const reader = new FileReader();
				reader.onloadend = function () {
					ImageSrc.src = reader.result;
					ImageSrc.style.display = 'block';
      			}
			reader.readAsDataURL(result);
		})
	}
</script>
`;
