import { useRef, useState } from "react";
import {  Button, Datepicker, Input, Layout, Text } from "@ui-kitten/components";
import { MainLayout } from "../../layouts/MainLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../navigation/StackNavigator";

import { getFoodById, updateCreateFood } from "../../../actions/comida";

import { ScrollView } from "react-native-gesture-handler";
import { MyIcon } from "../../components/ui/MyIcon";
import { Formik } from "formik";
import { Menu } from "../../../domain/entities/food";
import { FoodImage } from "../../components/foods/FoodImage";
import { CameraAdapter } from "../../../config/adapters/camera-adapter";
import { getTypeMenus } from "../../../actions/tipo_menu/get-type-menu-by-role";
import { Alert, StyleSheet, useColorScheme } from "react-native";
import { CustomSelect } from "../../components/ui/CustomSelect";
import * as Yup from 'yup';
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";

interface Props extends StackScreenProps<RootStackParams, 'FoodScreen'>{}

// 👇 Aquí lo defines

const emptyFood = {
  id: '',
  platillo: '',
  descripcion: '',
  costo: '',
  calorias: '',
  img_comida: '',
  inicio_fecha_platillo: '',
  fin_fecha_platillo: '',
  empresa: '',
  id_tipo_menu: '', // ✅
  estatus: 1,
};

export const FoodScreen = ({ route }: Props) => {
  const foodIdRef = useRef(route.params.foodId);
  const queryClient = useQueryClient();
  const isCreating = foodIdRef.current === 'new';
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);
  const [isSaving, setIsSaving] = useState(false);

  const { data: typeMenu = [], isLoading: loadingTypeMenu } = useQuery({
    queryKey: ['typeMenu'],
    queryFn: getTypeMenus,
  });

  const { data: menu } = useQuery({
    queryKey: ['menu', foodIdRef.current],
    queryFn: () => getFoodById(foodIdRef.current),
  });

  const mutation = useMutation({
    mutationFn: (data: Menu) => updateCreateFood({ ... data, id: foodIdRef.current }),
    onSuccess(data: Menu) {
      const id = data?.id ?? foodIdRef.current;
      foodIdRef.current = id;
      queryClient.invalidateQueries({ queryKey: ['menus', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['menu', data.id] });
    },
  });

  if (!menu) return <MainLayout title="Cargando..." />;

  const foodSchema = Yup.object().shape({
    platillo: Yup.string().required('El platillo es obligatorio'),
    costo: Yup.string().required('El costo es obligatorio'),
    img_comida: Yup.string().required('La imagen es obligatoria'),
    tipo_menu: Yup.object().shape({
      id: Yup.string().required('El tipo de menú es obligatorio'),
    }),
    estatus: Yup.number().required('El estatus es obligatorio'),
  });

  return (
    <Formik
      initialValues={menu || emptyFood}
      validationSchema={foodSchema}
      onSubmit={(values, { resetForm }) => {
        const foodToSend = {
          ...values,
          id: foodIdRef.current,
          id_tipo_menu: values.tipo_menu.id, // 👈 aquí haces el "map"
        };

        mutation.mutate(foodToSend);

        Toast.show({
          type: 'success',
          text1: isCreating ? 'Comida registrada' : 'Comida actualizada',
          text2: isCreating
            ? 'Se ha registrado la nueva comida'
            : 'Se han guardado los cambios correctamente',
        });

        if (isCreating) {
          queryClient.invalidateQueries({ queryKey: ['menus', 'infinite'] });
          resetForm();
        }

        setTimeout(() => setIsSaving(false), 800);
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => (
        <MainLayout
          title={values.platillo}
          subTitle={`Precio: $${Number(values.costo).toFixed(2)}`}
          rightAction={() => {
            Alert.alert('Selecciona una opción', '¿Qué deseas hacer?', [
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
            ]);
          }}
          rightActionIcon="camera-outline"
        >
          <ScrollView>
            <Layout style={styles.container}>
              {/* Imagen */}
              <Layout style={styles.imageContainer}>
                <FoodImage image={values.img_comida} style={styles.image} />
              </Layout>

              {/* Campos */}
              <Input
                label="Título del platillo"
                value={values.platillo}
                onChangeText={handleChange("platillo")}
                style={styles.input}
                status={touched.platillo && errors.platillo ? 'danger' : 'basic'}
                caption={touched.platillo && errors.platillo ? errors.platillo : ''}
              />

              <Input
                label="Descripción"
                multiline
                numberOfLines={4}
                textStyle={{ minHeight: 80 }}
                value={values.descripcion}
                onChangeText={handleChange("descripcion")}
                style={styles.input}
              />

              <Layout style={styles.row}>
                <Input
                  label="Precio"
                  keyboardType="numeric"
                  value={values.costo.toString()}
                  onChangeText={handleChange("costo")}
                  style={[styles.input, styles.flex]}
                  status={touched.costo && errors.costo ? 'danger' : 'basic'}
                  caption={touched.costo && errors.costo ? errors.costo : ''}
                />
                <Input
                  label="Calorías"
                  keyboardType="numeric"
                  value={values.calorias}
                  onChangeText={handleChange("calorias")}
                  style={[styles.input, styles.flex]}
                />
              </Layout>

              {/* Tipo de Menú */}
              <Text style={styles.label}>Tipo de Menú</Text>
              <CustomSelect
                options={typeMenu.map(tm => ({
                  label: tm.nombre,
                  value: tm.id,
                }))}
                selectedValue={values.tipo_menu.id}
                onValueChange={(val) => setFieldValue('id_tipo_menu', val)}
              />
              {touched.tipo_menu?.id && errors.tipo_menu?.id && (
                <Text style={{ color: 'red', marginTop: 5 }}>{errors.tipo_menu.id}</Text>
              )}

              {/* Fechas */}
              <Layout style={styles.input}>
                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Inicio del platillo</Text>
                <Datepicker
                  date={values.inicio_fecha_platillo ? new Date(values.inicio_fecha_platillo) : undefined}
                  onSelect={(nextDate) => setFieldValue('inicio_fecha_platillo', nextDate)}
                  controlStyle={{ backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20' }}
                  placeholder="Seleccionar fecha"
                />
              </Layout>

              <Layout style={styles.input}>
                <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Fin del platillo</Text>
                <Datepicker
                  date={values.fin_fecha_platillo ? new Date(values.fin_fecha_platillo) : undefined}
                  onSelect={(nextDate) => setFieldValue('fin_fecha_platillo', nextDate)}
                  controlStyle={{ backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20' }}
                  placeholder="Seleccionar fecha"
                />
              </Layout>

              {/* Estatus */}
              <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Estatus</Text>
              <CustomSelect
                options={[
                  { label: 'Disponible', value: 1 },
                  { label: 'No disponible', value: 0 },
                ]}
                selectedValue={values.estatus}
                onValueChange={(val) => setFieldValue('estatus', val)}
              />

              {/* Guardar */}
              <Button
                accessoryLeft={<MyIcon name="save-outline" white />}
                onPress={async () => {
                  setIsSaving(true);
                  try {
                    await mutation.mutateAsync({
                      ...values,
                      id: isCreating ? '' : values.id, // o foodIdRef.current
                    });

                    Toast.show({
                      type: 'success',
                      text1: isCreating ? 'Registro exitoso' : 'Actualización exitosa',
                      text2: isCreating ? 'El elemento ha sido creado correctamente' : 'Los cambios fueron guardados',
                    });

                    if (isCreating) {
                      resetForm(); // limpia formulario
                      queryClient.invalidateQueries({ queryKey: ['menus'] }); // o el queryKey correspondiente
                    }

                  } catch (error) {
                    if (isAxiosError(error)) {
                      const mensaje = error.response?.data?.mensaje;

                      if (Array.isArray(mensaje)) {
                        // Errores de validación: mostrar todos
                        mensaje.forEach(msg => {
                          Toast.show({
                            type: 'error',
                            text1: 'Error de validación',
                            text2: msg,
                          });
                        });
                      } else {
                        // Error general
                        Toast.show({
                          type: 'error',
                          text1: 'Error al guardar',
                          text2: mensaje || 'Error desconocido',
                        });
                      }
                    } else {
                      Toast.show({
                        type: 'error',
                        text1: 'Error inesperado',
                        text2: 'Algo salió mal. Intenta más tarde.',
                      });
                    }
                  } finally {
                    setTimeout(() => setIsSaving(false), 600);
                  }
                }}
                disabled={mutation.isPending}
                style={styles.saveButton}
              >
                Guardar Cambios
              </Button>
            </Layout>
            <Layout style={{ height: 100 }} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};

const createStyles = (isDarkMode: boolean) => 
  StyleSheet.create({
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
    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF20',
    borderColor: isDarkMode ? '#555' : '#FFFFFF55',
    borderRadius: 8,
    color: isDarkMode ? '#FFFFFF' : '#000000',
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
    backgroundColor: isDarkMode ? '#03a9f4' : '#7B1FA2',
  },
});