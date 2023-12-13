import React, { useState, useEffect } from "react";
import { Alert } from "react-native";

import { capitalizeFirstLetter } from "../../../utils/device";
import { useTranslation } from "react-i18next";

import { createPost } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostForm from "./form";

const CreatePostScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { communityId } = route.params;
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    };
    fetchUserInfo();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (!formData.category) {
        alert(t("no_category_selected_error"));
        return;
      }
      const post_response = await createPost(formData.title, formData.body, formData.category.id);
      if (post_response) {
        Alert.alert(
          capitalizeFirstLetter(t("success")),
          capitalizeFirstLetter(t("succesful_post_text"))
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <PostForm community_id={communityId} onSubmit={handleSubmit} />;
};

export default CreatePostScreen;
