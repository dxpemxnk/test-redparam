import React, { useState } from "react";

interface Param {
  id: number;
  name: string;
  type: "string";
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: string[];
}

interface Props {
  params: Param[];
  model: Model;
  getModel: (updatedModel: Model) => void; // Метод для передачи модели
}

const ParamEditor: React.FC<Props> = ({ params, model, getModel }) => {
  
  const [paramValues, setParamValues] = useState(model.paramValues);

  // Обработчик изменения значений
  const handleChange = (paramId: number, newValue: string) => {
    const updatedValues = paramValues.map((p) =>
      p.paramId === paramId ? { ...p, value: newValue } : p
    );
    setParamValues(updatedValues);

    // Обновляем модель и передаём её через getModel
    const updatedModel = { ...model, paramValues: updatedValues };
    getModel(updatedModel);
  };

  return (
    <div>
      {params.map((param) => {
        const value =
          paramValues.find((p) => p.paramId === param.id)?.value || "";
        return (
          <div key={param.id}>
            <label>{param.name}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(param.id, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
};

// Пример использования
const params: Param[] = [
  { id: 1, name: "Назначение", type: "string" },
  { id: 2, name: "Длина", type: "string" },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: "повседневное" },
    { paramId: 2, value: "макси" },
  ],
  colors: [],
};

// Функция getModel
const getModel = (updatedModel: Model) => {
  console.log("Текущая модель:", updatedModel);
};

const App = () => (
  <div>
    <h1>Редактор параметров</h1>
    <ParamEditor params={params} model={model} getModel={getModel} />
  </div>
);

export default App;
