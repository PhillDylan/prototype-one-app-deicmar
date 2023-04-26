//import { PhotoCamera } from "@mui/icons-material";
//import { Button, IconButton } from "@mui/material";
//import { Routes, Route, Navigate } from "react-router-dom";

//export const AppRoutes = () => {
//    return(
//        <Routes>
//            <Route path="/pagina-inicial" element={<IconButton color="primary" aria-label="upload picture" component="label"><input hidden accept="image/*" type="file" /><PhotoCamera /></IconButton>} />
//
//            <Route path="*" element={<Navigate to="/pagina-inicial" />} /> 
//        </Routes>
//    );
//}


import { PhotoCamera } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import React,{useState, useEffect} from "react";
import { useAppThemeContext } from "../shared/contexts";

export const AppRoutes = () => {
    const { toggleTheme } = useAppThemeContext();

  const [imagemSelecionada, setImagemSelecionada] = useState<string | undefined>();

  const handleImagemSelecionada = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const imagem = URL.createObjectURL(event.target.files[0]);
      setImagemSelecionada(imagem);
    }
  };

  return (
    <Routes>
      <Route
        path="/pagina-inicial"
        element={
          <>
            <Button variant="contained" color="primary" onClick={toggleTheme}>Toogle Theme</Button>
            <input
              hidden
              accept="image/*"
              type="file"
              id="imagem-input"
              onChange={handleImagemSelecionada}
            />
            <label htmlFor="imagem-input">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            {imagemSelecionada ? (
              <img
                src={imagemSelecionada}
                style={{ maxWidth: "300px", maxHeight: "300px", marginTop: "10px" }}
              />
            ) : (
              <p>Nenhuma imagem selecionada.</p>
            )}
          </>
        }
      />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};