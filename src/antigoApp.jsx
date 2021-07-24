import firebase from "./firebaseConection";
import { useState, useEffect } from "react";
import "./style.css";

function AntigoApp() {
	const [idPost, setIdPost] = useState("");
	const [titulo, setTitulo] = useState("");
	const [autor, setAutor] = useState("");
	const [posts, setPosts] = useState([]);

	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [user, setUser] = useState(false);
	const [userLogged, setUserlogged] = useState({});

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

	useEffect(() => {
		async function loadPosts() {
			await firebase
				.firestore()
				.collection("posts")
				.onSnapshot((doc) => {
					let listaPosts = [];
					doc.forEach((item) => {
						listaPosts.push({
							id: item.id,
							titulo: item.data().titulo,
							autor: item.data().autor,
						});
					});
					setPosts(listaPosts);
				});
		}
		loadPosts();
	}, []);

	async function buscaPost() {
		// await firebase
		// 	.firestore()
		// 	.collection("posts")
		// 	.doc("GiwoocZjQvMsSlZZ1R6T")
		// 	.get()
		// 	.then((snapshot) => {
		// 		setTitulo(snapshot.data().titulo);
		// 		setAutor(snapshot.data().autor);
		// 	})
		// 	.catch((err) => {
		// 		console.log("Deu algum error: " + err);
		// 	});

		await firebase
			.firestore()
			.collection("posts")
			.get()
			.then((snapshot) => {
				let lista = [];
				snapshot.forEach((doc) => {
					lista.push({
						id: doc.id,
						titulo: doc.data().titulo,
						autor: doc.data().autor,
					});
				});
				setPosts(lista);
			});
	}

	async function editarPost() {
		await firebase
			.firestore()
			.collection("post")
			.doc(idPost)
			.update({
				titulo: titulo,
				autor: autor,
			})
			.then(() => {
				console.log("Alterado com sucesso!");
				setIdPost("");
				setTitulo("");
				setAutor("");
			})
			.catch((err) => {
				console.log("Deu algum error: " + err);
			});
	}

	async function excluirPost(id) {
		await firebase
			.firestore()
			.collection("posts")
			.doc(id)
			.delete()
			.then(() => {
				console.log("Post excluido com sucesso: ");
			})
			.catch((err) => {
				console.log("Deu algum problema" + err);
			});
	}

	async function novoUsuario() {
		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, senha)
			.then((value) => {
				console.log("cadastrado com sucesso");
				console.log(value);
				setEmail("");
				setSenha("");
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

	useEffect(() => {
		async function checkLogin() {
			await firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					setUser(true);
					setUserlogged({
						uid: user.uid,
						email: user.email,
					});
					console.log("Logado");
				} else {
					setUser(false);
					setUserlogged({});
					console.log("Nao logado");
				}
			});
		}
		checkLogin();
	}, []);

	async function login() {
		await firebase
			.auth()
			.signInWithEmailAndPassword(email, senha)
			.then((value) => {
				console.log(value.user);
				setEmail("");
				setSenha("");
			})
			.catch((err) => {
				if (err.code === "auth/wrong-password") {
					alert("Senha invalida");
				} else if (err.code === "auth/weak-password") {
					alert("A senha precisa conter pelo menos 6 digitos");
				} else if (err.code === "auth/email-already-in-use") {
					alert("Email ja cadastrado");
				} else if (err.code === "auth/invalid-email") {
					alert("Esse email nao existe");
				} else if (err.code === "auth/user-not-found") {
					alert("Esse email nao esta cadastrado");
				}
				console.log(err);
			});
	}

	async function logout() {
		await firebase.auth().signOut();
	}

	return (
		<div className="App">
			<h1>Aprendendo a usar o firebase</h1>
			{user && (
				<div>
					<strong>Seja bem vindo voce esta logado!</strong> <br />
					<span>
						{userLogged.uid} - {userLogged.email}
					</span>
					<br /> <br />
				</div>
			)}
			<div className="container">
				<label>Email</label>
				<input
					type="text"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>{" "}
				<br />
				<label>Senha</label>
				<input
					type="password"
					value={senha}
					onChange={(e) => {
						setSenha(e.target.value);
					}}
				/>{" "}
				<br />
				<button onClick={login}>Fazer login</button>
				<button onClick={novoUsuario}>Cadastrar</button>
				<button onClick={logout}>Sair da conta</button>
				<hr />
				<br />
			</div>
			<div className="container">
				<h2>Banco de dados</h2>
				<label>Id do post</label>
				<input
					type="text"
					value={idPost}
					onChange={(e) => setIdPost(e.target.value)}
				/>
				<label>Titulo</label>
				<textarea
					type="text"
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
				></textarea>
				<label>Autor</label>
				<input
					type="text"
					value={autor}
					onChange={(e) => setAutor(e.target.value)}
				/>
				<button onClick={handleAdd}>Adicionar</button>
				<button onClick={buscaPost}>Buscar posts</button>
				<button onClick={editarPost}>Editar post</button> <br />
				<ul>
					{posts.map((post) => {
						return (
							<li key={post.id}>
								<span>Id: {post.id}</span> <br />
								<span>
									<strong>Titulo: {post.titulo}</strong>
								</span>
								<br />
								<span>Autor: {post.autor}</span>
								<br />
								<button
									onClick={() => {
										excluirPost(post.id);
									}}
								>
									Excluir
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}

export default AntigoApp;
