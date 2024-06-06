import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { decode } from 'he';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

// DecodeHtml Component
const tagsStyles = {
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  tr: {
    height: 40,
    width: 100,
    borderWidth: 1,
    borderColor: '#DCDCDC'
  },
  td: {
    height: 70,
    width: 100,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  ol: {
    marginTop: 10, 
    marginBottom: 10, 
    marginLeft: 20, 
  },
  ul: {
    marginTop: 10, 
    marginBottom: 10, 
    marginLeft: 5,
  },
  li: {
    paddingBottom: 5, 
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    width: '100%', 
  },
  tr: {
    flexDirection: 'row', // Đảm bảo các ô được sắp xếp theo chiều ngang
  },
  td: {
    flex: 1, // Căn chỉnh ô tự động mở rộng để chiếm hết không gian có sẵn
    padding: 8, 
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  strong: {
    fontWeight: 'bold',
  },
  img: {
    width: '100%',
    maxHeight: 700,
  }
};

const htmlProps = {
  renderers: {},
};



const htmlContent = `
TỔNG KẾT TRẠM 3 - SẴN S&Agrave;NG VỀ Đ&Iacute;CH<br />
<br />
Ch&uacute;c mừng c&aacute;c th&agrave;nh vi&ecirc;n may mắn trong Trạm 3.<br />
<br />
Ng&agrave;y mai số cuối c&ugrave;ng, ho&agrave; nhịp &quot;black friday&quot; Ollie cũng sale-off hết qu&agrave; đang c&oacute;, số lượng v&agrave; c&aacute;c loại qu&agrave; chắc chắn sẽ tăng l&ecirc;n.<br />
<br />
Hướng dẫn vượt trạm cuối c&ugrave;ng ở b&ecirc;n dưới, c&aacute;c OPPOer xem qua v&agrave; c&ugrave;ng sẵn s&agrave;ng về đ&iacute;ch Đường đua l&uacute;c 12:00 ng&agrave;y mai (Thứ 6 25/11) nh&eacute;.<br />
<br />
<img alt="" src="/public/assets/images/240501.jpg" style="height:1245px; width:700px" /><br />
<br />
<img alt="" src="/public/assets/images/240502.jpg" style="height:1400px; width:700px" />
`;

function DecodeHtml({ content }) {
  if (!content || content.length === 0) return null;

  const { width } = useWindowDimensions();
  const contentWithBaseUrl = content.replace(/src="\/public/g, `src="https://center.opposhop.vn/public`);
  const content_decode = decode(contentWithBaseUrl);
  const source = {
    html: content_decode || null
  };

  return (
    <RenderHtml
      contentWidth={width}
      source={source}
      tagsStyles={tagsStyles}
      ignoredStyles={["height", "width"]}
      {...htmlProps}
    />
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.htmlContainer}>
        <DecodeHtml content={htmlContent} containerStyle={styles.innerContainer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  htmlContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  innerContainer: {
    paddingBottom: 450, 
  },
});
