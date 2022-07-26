#include <bits/stdc++.h>
#define int long long

using namespace std;

const int N = 2e5 + 5;
int a[N], cnt[N], res;


int c2(int n)
{
    return (n * (n - 1))/2;
}

main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    //freopen("in.inp","r",stdin);

    int n; cin >> n;
    for(int i = 1; i <= n; i++)
        cin >> a[i];

    for(int i = 1; i <= n; i++)
        {
            cnt[a[i] % 200]++;
        }
    for(int i = 0; i <= 199; i++)
        res += c2(cnt[i]);

    cout << res;


    return 0;
}
