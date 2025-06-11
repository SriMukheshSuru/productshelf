import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  useColorModeValue,
  useToast,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../store/product";
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = "productshelf_preset";
const CLOUDINARY_CLOUD_NAME = "dxzqoogjt";

const CreatePage = () => {
  const [newProduct, setnewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const { createProduct } = useProductStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;
      setnewProduct((prev) => ({ ...prev, image: imageUrl }));

      toast({
        title: "Image Uploaded",
        description: "Image successfully uploaded to Cloudinary",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
    }
    setnewProduct({ name: "", price: "", image: "" });
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create New Product
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setnewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setnewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newProduct.image}
              onChange={(e) =>
                setnewProduct({ ...newProduct, image: e.target.value })
              }
            />

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              isDisabled={uploading}
            />

            {newProduct.image && (
              <Image
                src={newProduct.image}
                alt="Product Preview"
                boxSize="200px"
                objectFit="cover"
                rounded="md"
              />
            )}

            <Button
              colorScheme="blue"
              onClick={handleAddProduct}
              w="full"
              isLoading={uploading}
            >
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
