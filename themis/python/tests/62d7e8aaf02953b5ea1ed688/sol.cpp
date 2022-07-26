#include<stdio.h>
int main(){
  int n,a[200005];
  long long b[200]={0};
  scanf("%d",&n);
  for(int i=0;i<n;i++){
    scanf("%d",&a[i]);
    b[a[i]%200]++;
  }
  long long res=0;
  for(int k=0;k<200;k++){
    res+=(b[k]*(b[k]-1))/2;
  }
  printf("%lld\n",res);
  return 0;
}