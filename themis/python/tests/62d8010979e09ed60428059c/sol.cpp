#include<bits/stdc++.h>
using namespace std;
int main(){
  int n;
  long long k;
  cin >> n >> k;
  long long dp[4][3000005]={0};
  dp[0][0]=1;
  for(int i=0;i<3;i++){
    for(int j=0;j<=i*n;j++){
      dp[i+1][j+1]+=dp[i][j];
      dp[i+1][j+n+1]-=dp[i][j];
    }
    for(int j=1;j<=(i+1)*n;j++){
      dp[i+1][j]+=dp[i+1][j-1];
    }
  }
  
  int x;
  for(int i=3;i<=3*n;i++){
    if(k<=dp[3][i]){x=i;break;}
    else{k-=dp[3][i];}
  }
  for(int i=1;i<=n;i++){
    int jmi=max(1,x-i-n);
    int jma=min(n,x-i-1);
    if(jmi>jma){continue;}
    if(k>(jma-jmi+1)){k-=(jma-jmi+1);continue;}
    int y=jmi+k-1;
    int z=x-i-y;
    cout << i << ' ' << y << ' ' << z << '\n';
    return 0;
  }
}