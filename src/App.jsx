import firebase from "./firebaseConection";
import { useState } from "react";
import "./style.css";

function App() {
	const [titulo, setTitulo] = useState("");
	const [autor, setAutor] = useState("");

	async function handleAdd() {
		await firebase
			.firestore()
			.collection("posts")
			.add({
				titulo: titulo,
				autor: autor,
			})
			.then(() => {
				console.log("dados cadastrados com sucesso");
				setTitulo("");
				setAutor("");
			})
			.catch((err) => {
				console.log("Gerou algum erro" + err);
			});
	}

	async function buscaPost() {
		await firebase
			.firestore()
			.collection("posts")
			.doc("GiwoocZjQvMsSlZZ1R6T")
			.get()
			.then((snapshot) => {
				setTitulo(snapshot.data().titulo);
				setAutor(snapshot.data().autor);
			});
	}

	return (
		<div className="App">
			<h1>Aprendendo a usar o firebase</h1>
			<div className="container">
				<label>titulo</label>
				<textarea
					type="text"
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
				></textarea>
				<label>autor</label>
				<input
					type="text"
					value={autor}
					onChange={(e) => setAutor(e.target.value)}
				/>
				<button onClick={handleAdd}>Adicionar</button>
				<button onClick={buscaPost}>Buscar posts</button>
			</div>
		</div>
	);
}

export default App;
