const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

// A rota "get" irá retornar uma lista contendo todos os repositórios cadastrados.
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// A rota "post" irá criar um repositório e retornar um objeto com as informações do repositório criado.
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

// A rota "put" irá alterar apenas as informações recebidas pelo corpo da requisição e retornar um repositório atualizado.
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  };

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

// A rota delete irá receber o id do repositório que será excluído e retornar um status "204" após a exclusão.
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

// A rota post irá incrementar a quantidade de likes em 1 a cada chamada na rota post e será retornado o repositório com a quantidade de likes atualizada.
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  };

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);
});

module.exports = app;
