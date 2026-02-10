// data/collaborators.ts

export interface Collaborator {
  id: string;
  name: string;
  logo: string; // Ruta a la imagen en /public
  url: string;  // Sitio web de la entidad
}

export const COLLABORATORS: Collaborator[] = [
  // {
  //   id: "colab-1",
  //   name: "",
  //   logo: "/logos/",
  //   url: ""
  // },
];