import firebase from "./firebaseConection";
import { useState } from "react";
import "./style.css";

function App() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [nome, setNome] = useState("");
	const [cargo, setCargo] = useState("");

	const [user, setUser] = useState({});

	async function novoUsuario() {
		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, senha)
			.then(async (value) => {
				await firebase
					.firestore()
					.collection("users")
					.doc(value.user.uid)
					.set({
						nome: nome,
						cargo: cargo,
					})
					.then(() => {
						console.log("cadastrado com sucesso");
						console.log(value);
						setEmail("");
						setSenha("");
						setNome("");
						setCargo("");
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				if (error.code === "auth/weak-password") {
					alert("A senha precisa conter pelo menos 6 digitos");
				} else if (error.code === "auth/email-already-in-use") {
					alert("Email ja cadastrado");
				} else if (error.code === "auth/invalid-email") {
					alert("Esse email nao existe");
				}
				console.log(error);
			});
	}

	async function logout() {
		await firebase.auth().signOut();
		setUser({});
	}

	async function login() {
		await firebase
			.auth()
			.signInWithEmailAndPassword(email, senha)
			.then(async (value) => {
				await firebase
					.firestore()
					.collection("users")
					.doc(value.user.uid)
					.get()
					.then((snapshot) => {
						setUser({
							nome: snapshot.data().nome,
							cargo: snapshot.data().cargo,
							email: value.user.email,
						}).then(() => {
							setCargo("");
							setEmail("");
							setSenha("");
							setNome("");
						});
					})
					.catch((error) => {
						console.log("Erro ao passar as informacoes" + error);
					});
			})
			.catch((error) => {
				console.log("Erro ao logar" + error);
			});
	}

	return (
		<div className="App">
			<h1>Aprendendo a usar o firebase</h1>
			<div className="container">
				<label>Nome</label>
				<input
					type="text"
					value={nome}
					onChange={(e) => {
						setNome(e.target.value);
					}}
				/>
				<br />
				<label>Cargo</label>
				<input
					type="text"
					value={cargo}
					onChange={(e) => {
						setCargo(e.target.value);
					}}
				/>
				<br />
				<label>Email</label>
				<input
					type="text"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<br />
				<label>Senha</label>
				<input
					type="password"
					value={senha}
					onChange={(e) => {
						setSenha(e.target.value);
					}}
				/>
				<br />
				<button onClick={novoUsuario}>Cadastrar</button>
				<button onClick={login}>Fazer login</button>
				<button onClick={logout}>Sair da conta</button>
				<hr /> <br />
			</div>
			{Object.keys(user).length > 0 && (
				<div>
					<span>Ola {user.nome}</span>
					<br />
					<span>Voce e {user.cargo}</span>
					<br />
					<span>este e seu email {user.email}</span>
					<br />
				</div>
			)}
		</div>
	);
}

export default App;
