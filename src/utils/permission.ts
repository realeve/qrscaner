import router from 'umi/router';
const isValid = (url: string, user: { username: string; uid: string }) => {
  switch (url) {
    default:
      router.push('/');
      break;
  }
};
