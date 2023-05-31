import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LayoutBaseDePagina } from "../../../shared/layouts";

import FeaturedPost from "./FeaturedPost";

const currentDate = new Date();
const month = currentDate.toLocaleString("default", { month: "short" });
const day = currentDate.getDate();

const featuredPosts = [
  {
    title: "GATE IN",
    date: `${month} ${day}`,
    description:
      "AO SELECIONAR ESTE CAMPO VOCE SERA REDIRECIONADO PARA FAZER OS CHECKLIST DO GATE IN",
    path: "/agendamento2",
    image: "",
    imageLabel: "",
  },
  // ...
  /*  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
      path: 'agendamento2'
  },*/
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const Blog = () => {
  return (
    <LayoutBaseDePagina titulo="TIPO DE GATE">
        <Container maxWidth="lg">
          <main>
            <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid>
            <Grid container spacing={5} sx={{ mt: 3 }}></Grid>
          </main>
        </Container>
    </LayoutBaseDePagina>
  );
};
