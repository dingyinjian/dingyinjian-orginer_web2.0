const path=require('path')
const webpack=require('webpack')

module.exports={
    configureWebpack:{
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
              })
        ],
        resolve:{
            alias:{
                '@':path.resolve('src')
            }
        }
    }
}