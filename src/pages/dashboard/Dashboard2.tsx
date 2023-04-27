import { BarraDeFerramentas } from "../../shared/components"
import { LayoutBaseDePagina } from "../../shared/layouts"

export const Dashboard2 = () => {

    return(
        <LayoutBaseDePagina
            titulo="Pagina de Teste"
            barraDeFerramentas={(
                <BarraDeFerramentas 
                    mostrarInputBusca="true"
                    textoBotaoNovo="Nova"
                />
            )}>
          
          Testando 
        
        </LayoutBaseDePagina>
    );
};
