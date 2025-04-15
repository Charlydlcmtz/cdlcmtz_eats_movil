import { useRef, useState } from "react";
import {  Button, Datepicker, IndexPath, Input, Layout, Select, SelectItem, Text, useTheme } from "@ui-kitten/components";
import { MainLayout } from "../../layouts/MainLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";

import { getFoodById, updateCreateFood } from "../../../actions/comida";

import { ScrollView } from "react-native-gesture-handler";
import { MyIcon } from "../../components/ui/MyIcon";
import { Formik } from "formik";
import { Food } from "../../../domain/entities/food";
import { FoodImage } from "../../components/foods/FoodImage";
import { CameraAdapter } from "../../../config/adapters/camera-adapter";
import { getTypeMenus } from "../../../actions/tipo_menu/get-type-menu-by-role";
import { Alert, StyleSheet } from "react-native";

interface Props extends StackScreenProps<RootStackParams, 'FoodScreen'>{}

export const FoodScreen = ({ route }:Props) => {
  const foodIdRef = useRef(route.params.foodId);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date());

  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));

  const { data: typeMenu = [], isLoading: loadingTypeMenu } = useQuery({
    queryKey: ['typeMenu'],
    queryFn: getTypeMenus,
  });

  //useQuery
  const { data: food } = useQuery({
    queryKey: ['food', foodIdRef.current ],
    queryFn: () => getFoodById(foodIdRef.current),
  });

  //useMutation
  const mutation = useMutation({
    mutationFn: (data: Food ) => updateCreateFood({... data, id: foodIdRef.current}),
    onSuccess( data: Food){
      const id = data?.id ?? foodIdRef.current;
      foodIdRef.current = id; // creación
      queryClient.invalidateQueries({ queryKey: ['foods', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['food', data.id] });
    },
  });

  if (!food) {
    return (<MainLayout title="Cargando..." />);
  }

    return (
      <Formik initialValues={food} onSubmit={mutation.mutate}>
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
          <MainLayout
            title={values.platillo}
            subTitle={`Precio: $${Number(values.costo).toFixed(2)}`}
            rightAction={() => {
              Alert.alert(
                'Selecciona una opción',
                '¿Qué deseas hacer?',
                [
                  {
                    text: 'Tomar foto',
                    onPress: async () => {
                      const img = await CameraAdapter.takePicture();
                      setFieldValue('img_comida', img);
                    },
                  },
                  {
                    text: 'Elegir de galería',
                    onPress: async () => {
                      const img = await CameraAdapter.getPicturesFromLibrary();
                      setFieldValue('img_comida', img);
                    },
                  },
                  { text: 'Cancelar', style: 'cancel' },
                ],
                { cancelable: true }
              );
            }}
            rightActionIcon="camera-outline"
          >
            <ScrollView>
              <Layout style={styles.container}>

                {/* Imagen */}
                <Layout style={styles.imageContainer}>
                  <FoodImage image={values.img_comida} style={styles.image} />
                </Layout>

                {/* Título */}
                <Input
                  label="Título del platillo"
                  placeholder="Ej. Hamburguesa"
                  value={values.platillo}
                  onChangeText={handleChange("platillo")}
                  style={styles.input}
                />

                {/* Descripción */}
                <Input
                  label="Descripción"
                  placeholder="Describe el platillo"
                  multiline
                  numberOfLines={4}
                  textStyle={{ minHeight: 80 }}
                  value={values.descripcion}
                  onChangeText={handleChange("descripcion")}
                  style={styles.input}
                />

                {/* Precio y Calorías */}
                <Layout style={styles.row}>
                  <Input
                    label="Precio"
                    keyboardType="numeric"
                    value={values.costo.toString()}
                    onChangeText={handleChange("costo")}
                    style={[styles.input, styles.flex]}
                  />
                  <Input
                    label="Calorías"
                    keyboardType="numeric"
                    value={values.calorias}
                    onChangeText={handleChange("calorias")}
                    style={[styles.input, styles.flex]}
                  />
                </Layout>

                {/* Tipo Menú */}
                <Text style={styles.label}>Tipo de Menú</Text>
                <Select
                  placeholder="Seleccionar tipo de menú"
                  disabled={loadingTypeMenu}
                  selectedIndex={
                    typeMenu.findIndex((e) => e.id === values.tipo_menu.id) >= 0
                      ? new IndexPath(typeMenu.findIndex((e) => e.id === values.tipo_menu.id))
                      : undefined
                  }
                  value={
                    typeMenu.find((e) => e.id === values.tipo_menu.id)?.nombre ||
                    "Seleccionar tipo de menú"
                  }
                  onSelect={(index) => {
                    if (Array.isArray(index)) return;
                    const selected = typeMenu[index.row];
                    setFieldValue("id_type_menu", selected.id);
                  }}
                  style={styles.input}
                >
                  {typeMenu.map((tm) => (
                    <SelectItem key={tm.id} title={tm.nombre} />
                  ))}
                </Select>

                {/* Fecha */}
                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Inicio del platillo</Text>
                <Datepicker
                  date={new Date(values.inicio_fecha_platillo)}
                  onSelect={(nextDate) => setFieldValue('inicio_fecha_platillo', nextDate)}
                />

                {/* Fecha */}
                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Fin del platillo</Text>
                <Datepicker
                  date={new Date(values.fin_fecha_platillo)}
                  onSelect={(nextDate) => setFieldValue('fin_fecha_platillo', nextDate)}
                />

                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Estatus</Text>

                <Select
                  placeholder="Seleccionar estatus"
                  selectedIndex={new IndexPath(values.estatus === 1 ? 0 : 1)}
                  value={values.estatus === 1 ? 'Disponible' : 'No disponible'}
                  onSelect={(index) => {
                    if (Array.isArray(index)) return;
                    const value = index.row === 0 ? 1 : 0;
                    setFieldValue('id_estatus', value);
                  }}
                >
                  <SelectItem title="Disponible" />
                  <SelectItem title="No disponible" />
                </Select>

                {touched.estatus && errors.estatus && (
                  <Text style={{ color: 'red', marginTop: 5 }}>{errors.estatus}</Text>
                )}

                {/* Botón de guardar */}
                <Button
                  accessoryLeft={<MyIcon name="save-outline" white />}
                  onPress={() => handleSubmit()}
                  disabled={mutation.isPending}
                  style={styles.saveButton}
                >
                  Guardar Cambios
                </Button>
              </Layout>
              <Layout style={{ height: 100 }}  />
            </ScrollView>
          </MainLayout>
        )}
      </Formik>
    );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 20,
  },
  input: {
    marginBottom: 15,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 10,
  },
});