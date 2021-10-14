import Bandeira from "@/components/Bandeira/Bandeira";
import { mount } from "@vue/test-utils";

const dadosBandeira = [
  { name: "Brasil", flag: "https://flagcdn.com/br.svg", alpha3Code: "BRA" },
  { name: "Argentina", flag: "https://flagcdn.com/pt.svg", alpha3Code: "ARG" },
  { name: "Angola", flag: "https://flagcdn.com/ao.svg", alpha3Code: "AGO" }
];

describe("Recebendo e carregando as bandeiras", () => {
  test("Exibindo o numero correto de bandeiras", () => {
    const wrapper = mount(Bandeira, { propsData: { paises: dadosBandeira } });
    const qntdPropsExibidos = wrapper.findAll("img").length;
    const qntdPropsEsperados = dadosBandeira.length;

    expect(qntdPropsEsperados).toBe(qntdPropsExibidos);
  }),
    test("Verificando se todas bandeiras receberam props src e alt", () => {
      const wrapper = mount(Bandeira, { propsData: { paises: dadosBandeira } });
      const paises = wrapper.findAll(".bandeira").wrappers;

      for (var i of [...Array(dadosBandeira.length).keys()]) {
        expect(paises[i].attributes("src")).toEqual(dadosBandeira[i].flag);
        expect(paises[i].attributes("alt")).toEqual(dadosBandeira[i].name);
      }
    });
});

describe("Funcionalidades do clique", () => {
  test("Numero de emits enviados corretos", () => {
    const wrapper = mount(Bandeira, { propsData: { paises: dadosBandeira } });
    const bandeiras = wrapper.findAll(".bandeira").wrappers;

    for (var i of [...Array(dadosBandeira.length).keys()]) {
      bandeiras[i].trigger("click");
    }

    //wrapper.vm.$nextTick();
    const qntdCliquesEsperados = dadosBandeira.length;

    const qntdCliques = wrapper.emitted().paisSelecionado.length;
    expect(qntdCliques).toBe(qntdCliquesEsperados);
  });

  test("Enviando os argumentos corretos no emit", () => {
    const wrapper = mount(Bandeira, { propsData: { paises: dadosBandeira } });
    const bandeiras = wrapper.findAll(".bandeira").wrappers;

    for (var i of [...Array(dadosBandeira.length).keys()]) {
      bandeiras[i].trigger("click");
    }

    const argumentosEnviados = wrapper.emitted().paisSelecionado;
    var arg = "";
    for (var j of [...Array(argumentosEnviados.length).keys()]) {
      arg = argumentosEnviados[j][0];
      expect(arg).toEqual(dadosBandeira[j].alpha3Code);
    }
  });
});
