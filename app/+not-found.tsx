import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function NotFoundScreen() {
  return (
    <View className='flex-1 items-center justify-center p-5'>
      <Text className='text-xl font-bold'>Essa tela não existe.</Text>
      <Link href='/' className='mt-4 text-purple-600 font-bold'>
        Voltar para o início
      </Link>
    </View>
  )
}
